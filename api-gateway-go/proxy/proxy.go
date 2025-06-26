package proxy

import (
	"api-gateway/models"
	"bytes"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type ProxyHandler struct {
	routes []models.Route
	client *http.Client
}

// NewProxyHandler crée un nouveau gestionnaire de proxy
func NewProxyHandler(routes []models.Route) *ProxyHandler {
	return &ProxyHandler{
		routes: routes,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// SetupRoutes configure toutes les routes de proxy sur le routeur Gin
func (p *ProxyHandler) SetupRoutes(router *gin.Engine) {
	// Les routes sont déjà triées par longueur dans routes.go
	// Configurer chaque route
	for _, route := range p.routes {
		p.setupRoute(router, route)
	}
}

// setupRoute configure une route individuelle
func (p *ProxyHandler) setupRoute(router *gin.Engine, route models.Route) {
	handler := p.createProxyHandler(route)
	
	// Ajouter la route exacte
	router.Any(route.URL, handler)
	
	// Ajouter la route avec wildcard seulement pour les routes générales
	// (pas pour les routes spécifiques qui contiennent des segments comme api-docs)
	if !strings.Contains(route.URL, "api-docs") {
		// Vérifier qu'aucune route plus spécifique n'existe déjà
		hasConflict := false
		for _, otherRoute := range p.routes {
			if otherRoute.URL != route.URL && strings.HasPrefix(otherRoute.URL, route.URL+"/") {
				hasConflict = true
				break
			}
		}
		
		if !hasConflict {
			router.Any(route.URL+"/*path", handler)
		}
	}
}

// createProxyHandler crée un handler pour une route spécifique
func (p *ProxyHandler) createProxyHandler(route models.Route) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Vérifier le filtre de chemin si défini
		if route.Proxy.PathFilter != nil {
			if !route.Proxy.PathFilter.MatchString(c.Request.URL.Path) {
				c.JSON(http.StatusNotFound, gin.H{
					"error": "Path not allowed",
				})
				return
			}
		}

		// Construire l'URL de destination
		targetURL, err := p.buildTargetURL(c, route)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to build target URL",
			})
			return
		}

		// Effectuer la requête proxy
		if err := p.proxyRequest(c, targetURL); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{
				"error": "Proxy request failed",
			})
			return
		}
	}
}

// buildTargetURL construit l'URL de destination pour la requête proxy
func (p *ProxyHandler) buildTargetURL(c *gin.Context, route models.Route) (*url.URL, error) {
	target := route.Proxy.Target
	
	// Récupérer le chemin d'origine
	path := c.Request.URL.Path
	
	// Si nous avons un paramètre path (wildcard route), l'utiliser
	if pathParam := c.Param("path"); pathParam != "" {
		path = pathParam
		// S'assurer que le chemin commence par /
		if !strings.HasPrefix(path, "/") {
			path = "/" + path
		}
	} else {
		// Pour les routes exactes, supprimer le préfixe de la route
		if strings.HasPrefix(path, route.URL) && route.URL != "/" {
			path = strings.TrimPrefix(path, route.URL)
			if path == "" {
				path = "/"
			} else if !strings.HasPrefix(path, "/") {
				path = "/" + path
			}
		}
	}
	
	// Appliquer la réécriture de chemin si définie
	if route.Proxy.PathRewrite != nil {
		for pattern, replacement := range route.Proxy.PathRewrite {
			path = strings.ReplaceAll(path, pattern, replacement)
		}
	}

	// Construire l'URL complète
	targetURL, err := url.Parse(target + path)
	if err != nil {
		return nil, err
	}

	// Ajouter les paramètres de requête
	if c.Request.URL.RawQuery != "" {
		targetURL.RawQuery = c.Request.URL.RawQuery
	}

	return targetURL, nil
}

// proxyRequest effectue la requête proxy et copie la réponse
func (p *ProxyHandler) proxyRequest(c *gin.Context, targetURL *url.URL) error {
	// Lire le corps de la requête
	var body io.Reader
	if c.Request.Body != nil {
		bodyBytes, err := io.ReadAll(c.Request.Body)
		if err != nil {
			return err
		}
		body = bytes.NewReader(bodyBytes)
	}

	// Créer la requête
	req, err := http.NewRequest(c.Request.Method, targetURL.String(), body)
	if err != nil {
		return err
	}

	// Copier les headers
	for key, values := range c.Request.Header {
		// Ignorer certains headers qui ne doivent pas être forwarded
		if key == "Host" || key == "Connection" || key == "Transfer-Encoding" {
			continue
		}
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	// Définir le host si ChangeOrigin est activé
	if c.Request.Header.Get("Host") != "" {
		req.Host = targetURL.Host
	}

	// Effectuer la requête
	resp, err := p.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Copier les headers de réponse
	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	// Définir le status code
	c.Status(resp.StatusCode)

	// Copier le corps de la réponse
	_, err = io.Copy(c.Writer, resp.Body)
	return err
}
