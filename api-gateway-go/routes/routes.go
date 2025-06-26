package routes

import (
	"api-gateway/models"
)

// GetRoutes retourne la configuration des routes
func GetRoutes(publicAPIURL, privateAPIURL string) []models.Route {
	routes := []models.Route{		
		// Routes générales en dernier
		{
			URL:         "/private",
			Auth:        false,
			CreditCheck: false,
			Proxy: models.ProxyConfig{
				Target:       privateAPIURL,
				ChangeOrigin: true,
			},
		},
		{
			URL:         "/public",
			Auth:        false,
			CreditCheck: false,
			Proxy: models.ProxyConfig{
				Target:       publicAPIURL,
				ChangeOrigin: true,
			},
		},
	}

	return routes
}
