package users

import (
	"api/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes registers all routes related to user management
// r: the RouterGroup to which the routes are added
func RegisterRoutes(r *gin.RouterGroup) {    
    user := r.Group("/user")
    user.Use(middleware.AuthMiddleware())
    {
        // User profile routes
        user.GET("/profile", GetUserProfile)
        user.PUT("/profile", UpdateUserProfile)
        user.PUT("/profile/password", UpdateUserPassword)
        
        // User management routes
        user.GET("/", GetUsers)
        user.PUT("/:id", UpdateTargetUserProfile)
        user.DELETE("/:id", DeleteUser)
        user.DELETE("/bulk", BulkDeleteUsers)
        user.PUT("/block/:id", ToggleBlockUser)
        user.PUT("/resetpass/:id", ResetUserPassword)
    }
}