package v1

import (
	"api/config"
	"api/middleware"

	"github.com/gin-gonic/gin"
)

// Register the endpoints for the v1 API
func Register(r *gin.Engine) {
    v1 := r.Group("/api/v1")
	
	rateLimiter := middleware.NewRateLimiter(100, 150) // 100 requests per second, 150 burst
    
    // Check if LAN mode is enabled via environment variable
    if config.LANMode {
        rateLimiter.EnableLANMode()
    }
    
    v1.Use(middleware.RateLimiterMiddleware(rateLimiter))

	RegisterUserRoutes(v1)
    RegisterAuthRoutes(v1)
}