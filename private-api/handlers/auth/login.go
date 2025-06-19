package auth

import (
	"api/database"
	"api/models"
	"api/utils"
	"api/utils/response"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// Login handles user authentication and returns a JWT token
// @Summary User Login
// @Description Authenticate a user and return a JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param login body LoginRequest true "Login Credentials"
// @Success 200 {object} AuthResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /auth/login [post]
func Login(c *gin.Context) {
	var loginReq LoginRequest
	
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	if len(strings.TrimSpace(loginReq.Email)) == 0 || len(strings.TrimSpace(loginReq.Password)) == 0 {
		response.Error(c, http.StatusBadRequest, "Email and password cannot be empty")
		return
	}
	
	var user models.User
	if err := database.DB.Where("email = ?", loginReq.Email).First(&user).Error; err != nil {
		response.Error(c, http.StatusUnauthorized, ErrInvalidCredentials)
		return
	}
	
	// Check if the user is blocked
	if user.Blocked {
		response.Error(c, http.StatusUnauthorized, ErrAccountBlocked)
		return
	}
	
	// Verify the password
	if !utils.CheckPasswordHash(loginReq.Password, user.Password) {
		response.Error(c, http.StatusUnauthorized, ErrInvalidCredentials)
		return
	}
	
	// Generate a JWT token
	token, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, ErrTokenGenerateFailed)
		return
	}
	
	// Set the token as an HTTP-only cookie
	setCookieToken(c, token, loginReq.RememberMe)
	
	// Update the last connection time
	now := time.Now()
	user.LastConnected = &now
	if err := database.DB.Save(&user).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, ErrUserLoginFailed)
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token:         token,
		UserID:        user.ID,
		Email:         user.Email,
		Firstname:     user.Firstname,
		Lastname:      user.Lastname,
		LastConnected: user.LastConnected,
		Blocked: 	   user.Blocked,
	})
}