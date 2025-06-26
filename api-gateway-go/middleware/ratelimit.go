package middleware

import (
	"api-gateway/models"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	clients map[string]*models.RateLimitEntry
	mutex   sync.RWMutex
	maxReqs int
	window  time.Duration
}

// NewRateLimiter crée un nouveau rate limiter
func NewRateLimiter(maxReqs int, windowSec int) *RateLimiter {
	rl := &RateLimiter{
		clients: make(map[string]*models.RateLimitEntry),
		maxReqs: maxReqs,
		window:  time.Duration(windowSec) * time.Second,
	}

	// Nettoyage périodique des entrées expirées
	go rl.cleanup()

	return rl
}

// RateLimit middleware pour Gin
func (rl *RateLimiter) RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()

		rl.mutex.Lock()
		defer rl.mutex.Unlock()

		now := time.Now()
		entry, exists := rl.clients[clientIP]

		if !exists || now.After(entry.ResetTime) {
			// Nouvelle entrée ou fenêtre expirée
			rl.clients[clientIP] = &models.RateLimitEntry{
				Count:     1,
				ResetTime: now.Add(rl.window),
			}
			c.Next()
			return
		}

		if entry.Count >= rl.maxReqs {
			// Limite atteinte
			c.Header("X-RateLimit-Limit", string(rune(rl.maxReqs)))
			c.Header("X-RateLimit-Remaining", "0")
			c.Header("X-RateLimit-Reset", string(rune(entry.ResetTime.Unix())))
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "Rate limit exceeded",
				"message": "Too many requests, please try again later",
			})
			c.Abort()
			return
		}

		// Incrémenter le compteur
		entry.Count++
		remaining := rl.maxReqs - entry.Count
		
		c.Header("X-RateLimit-Limit", string(rune(rl.maxReqs)))
		c.Header("X-RateLimit-Remaining", string(rune(remaining)))
		c.Header("X-RateLimit-Reset", string(rune(entry.ResetTime.Unix())))
		
		c.Next()
	}
}

// cleanup nettoie périodiquement les entrées expirées
func (rl *RateLimiter) cleanup() {
	ticker := time.NewTicker(rl.window)
	defer ticker.Stop()

	for range ticker.C {
		rl.mutex.Lock()
		now := time.Now()
		for ip, entry := range rl.clients {
			if now.After(entry.ResetTime) {
				delete(rl.clients, ip)
			}
		}
		rl.mutex.Unlock()
	}
}
