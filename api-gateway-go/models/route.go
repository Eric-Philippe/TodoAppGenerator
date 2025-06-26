package models

import (
	"regexp"
	"time"
)

// Route représente une route de proxy avec ses configurations
type Route struct {
	URL         string       `json:"url"`
	Auth        bool         `json:"auth"`
	CreditCheck bool         `json:"creditCheck"`
	RateLimit   *RateLimit   `json:"rateLimit,omitempty"`
	Proxy       ProxyConfig  `json:"proxy"`
}

// RateLimit définit les limites de taux pour une route
type RateLimit struct {
	WindowMs int `json:"windowMs"` // Fenêtre en millisecondes
	Max      int `json:"max"`      // Nombre maximum de requêtes
}

// ProxyConfig contient la configuration pour le proxy
type ProxyConfig struct {
	Target       string                 `json:"target"`
	Router       map[string]string      `json:"router,omitempty"`
	ChangeOrigin bool                   `json:"changeOrigin"`
	PathFilter   *regexp.Regexp         `json:"-"` // Compilé en runtime
	PathRewrite  map[string]string      `json:"pathRewrite,omitempty"`
}

// ProxyRequest représente une requête en cours de traitement
type ProxyRequest struct {
	OriginalURL string
	TargetURL   string
	Headers     map[string][]string
	Body        []byte
	Method      string
	StartTime   time.Time
}

// RateLimitEntry représente une entrée dans le système de rate limiting
type RateLimitEntry struct {
	Count     int       `json:"count"`
	ResetTime time.Time `json:"resetTime"`
}
