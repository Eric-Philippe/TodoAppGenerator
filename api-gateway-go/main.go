package main

import (
	"api-gateway/config"
	"api-gateway/middleware"
	"api-gateway/proxy"
	"api-gateway/routes"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Charger la configuration
	cfg := config.LoadConfig()

	// Configurer Gin selon l'environnement
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Créer le routeur Gin
	router := gin.New()

	// Ajouter les middlewares globaux
	router.Use(middleware.Logger())
	router.Use(middleware.ErrorHandler())
	router.Use(middleware.CORS())

	// Rate limiter global
	rateLimiter := middleware.NewRateLimiter(cfg.RateLimitMax, cfg.RateLimitWindow)
	router.Use(rateLimiter.RateLimit())

	// Route de santé
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"service": "api-gateway",
		})
	})

	// Route racine
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "API Gateway is running",
			"version": "2.0.0",
			"environment": cfg.Environment,
		})
	})

	// Configurer les routes de proxy
	routeConfigs := routes.GetRoutes(cfg.PublicAPIURL, cfg.PrivateAPIURL)
	proxyHandler := proxy.NewProxyHandler(routeConfigs)
	proxyHandler.SetupRoutes(router)

	// Démarrer le serveur
	log.Printf("🚀 API Gateway starting on port %s", cfg.Port)
	log.Printf("📡 Public API: %s", cfg.PublicAPIURL)
	log.Printf("🔒 Private API: %s", cfg.PrivateAPIURL)
	log.Printf("🌍 Environment: %s", cfg.Environment)

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
