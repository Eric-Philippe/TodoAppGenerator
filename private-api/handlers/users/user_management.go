package users

import (
	"api/database"
	"api/models"
	"api/utils"
	"api/utils/response"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// createUser creates a new user with basic information
// firstName, lastName, email: basic user information
// returns: the created user and any error
func createUser(firstName, lastName, email string) (*models.User, error) {
    // Input validation
    if firstName == "" || lastName == "" || email == "" {
        return nil, errors.New("first name, last name, and email are required")
    }

    // Generate a default password
    hashedPassword, err := utils.CreateDefaultPassword()
    if err != nil {
        return nil, err
    }
    
    user := &models.User{
        Firstname:         firstName,
        Lastname:          lastName,
        Email:             email,
        Password:          hashedPassword,
        HasDefaultPassword: true,
    }
    
    return user, nil
}

// GetUsers retrieves all users accessible to the authenticated user
// @Summary Get All users that the current user has access to 
// @Description Get all users that the current user has access to
// @Tags Users
// @Success 200 {array} models.User
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user/ [get]
// @Security Bearer
func GetUsers(c *gin.Context) {
    // user, err := middleware.GetUserFromRequest(c)
    // if err != nil {
    //     return // Error already handled by middleware
    // }

    var users []models.User

    // Hide passwords in response
    for i := range users {
        users[i].Password = ""
    }

    c.JSON(http.StatusOK, users)
}

// pluckIDs extracts the IDs from a slice of users
func pluckIDs(users []models.User) []string {
    ids := make([]string, len(users))
    for i, user := range users {
        ids[i] = user.ID
    }
    return ids
}

// DeleteUser deletes a user by ID
// @Summary Delete User
// @Description Delete a user by ID, if user is Staff, requires ownership permission
// @Tags Users
// @Param id path string true "User ID"
// @Success 204
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user/{id} [delete]
// @Security Bearer
func DeleteUser(c *gin.Context) {
    // user, err := middleware.GetUserFromRequest(c)
    // if err != nil {
    //     return // Error already handled by middleware
    // }

    userID := c.Param("id")
    if userID == "" {
        response.Error(c, http.StatusBadRequest, "User ID is required")
        return
    }

    // Check if target user exists
    var targetUser models.User
    if err := database.DB.First(&targetUser, "id = ?", userID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            response.Error(c, http.StatusNotFound, ErrUserNotFound)
        } else {
            response.Error(c, http.StatusInternalServerError, "Database error when finding user")
        }
        return
	}

    // Start a transaction to ensure atomicity of operations
    tx := database.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()

    // Delete the user
    if err := tx.Delete(&targetUser).Error; err != nil {
        tx.Rollback()
        response.Error(c, http.StatusInternalServerError, ErrFailedToDeleteUser)
        return
    }

    // Commit the transaction
    if err := tx.Commit().Error; err != nil {
        response.Error(c, http.StatusInternalServerError, "Failed to commit transaction")
        return
    }
    
    c.Status(http.StatusNoContent)
}

// BulkDeleteUsers deletes multiple users by IDs
// @Summary Bulk Delete Users
// @Description Bulk delete users by IDs
// @Tags Users
// @Accept json
// @Produce json
// @Param ids body []string true "User IDs"
// @Success 204
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user/bulk [delete]
// @Security Bearer
func BulkDeleteUsers(c *gin.Context) {
    // Get authenticated user
    // user, err := middleware.GetUserFromRequest(c)
    // if err != nil {
    //     return // Error already handled by middleware
    // }

    utils.DisplayBodyContent(c)

    // Parse user IDs from request body
    var reqBody UserIDsRequest
    if err := c.ShouldBindJSON(&reqBody); err != nil {
        response.Error(c, http.StatusBadRequest, ErrInvalidUserIDs)
        return
    }
    
    userIDs := reqBody.UserIDs
    
    if len(userIDs) == 0 {
        response.Error(c, http.StatusBadRequest, ErrEmptyUserIDs)
        return
    }

    // Check if users exist
    var users []models.User
    if err := database.DB.Where("id IN ?", userIDs).Find(&users).Error; err != nil {
        response.Error(c, http.StatusInternalServerError, ErrFailedToGetUsers)
        return
    }
    
    if len(users) == 0 {
        response.Error(c, http.StatusNotFound, ErrUserNotFound)
        return
    }
    
    // Start a transaction to ensure atomicity of operations
    tx := database.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()
    
    // Delete the users
    if err := tx.Where("id IN ?", userIDs).Delete(&models.User{}).Error; err != nil {
        tx.Rollback()
        response.Error(c, http.StatusInternalServerError, ErrFailedToDeleteUsers)
        return
    }
    
    // Commit the transaction
    if err := tx.Commit().Error; err != nil {
        response.Error(c, http.StatusInternalServerError, "Failed to commit transaction")
        return
    }
    
    c.Status(http.StatusNoContent)
}

// ToggleBlockUser toggles the block status of a user
// @Summary Toggle Block User
// @Description Toggle the block status of a user
// @Tags Users
// @Param id path string true "User ID"
// @Success 200 {object} models.User
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user/block/{id} [put]
// @Security Bearer
func ToggleBlockUser(c *gin.Context) {
    // user, err := middleware.GetUserFromRequest(c)
    // if err != nil {
    //     return // Error already handled by middleware
    // }

    userID := c.Param("id")
    if userID == "" {
        response.Error(c, http.StatusBadRequest, "User ID is required")
        return
    }
    
    // Check if target user exists
    var targetUser models.User
    if err := database.DB.First(&targetUser, "id = ?", userID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            response.Error(c, http.StatusNotFound, ErrUserNotFound)
        } else {
            response.Error(c, http.StatusInternalServerError, "Database error when finding user")
        }
        return
    }

    // Use transaction for update
    tx := database.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()
    
    // Toggle block status
    updateFields := map[string]interface{}{
        "blocked": !targetUser.Blocked,
    }
    
    if err := tx.Model(&targetUser).Updates(updateFields).Error; err != nil {
        tx.Rollback()
        response.Error(c, http.StatusInternalServerError, "Failed to update user block status")
        return
    }
    
    if err := tx.Commit().Error; err != nil {
        response.Error(c, http.StatusInternalServerError, "Failed to commit transaction")
        return
    }
    
    // Retrieve the updated user to return
    if err := database.DB.First(&targetUser, "id = ?", userID).Error; err != nil {
        response.Error(c, http.StatusInternalServerError, "User updated but failed to retrieve updated data")
        return
    }
    
    // Hide password
    targetUser.Password = ""
    
    c.JSON(http.StatusOK, targetUser)
}