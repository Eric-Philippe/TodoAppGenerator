package users

import "api/models"

// Error messages constants
const (
	ErrNotFound               = "User not found"
	ErrUserNotFound		      = "User not found"
	ErrUnauthorized           = "Unauthorized access"
	ErrFailedToHashPassword   = "Failed to hash password"
	ErrFailedToGetUsers       = "Failed to get users"
	ErrFailedToDeleteUser     = "Failed to delete user"
	ErrNoPermissionDelete     = "User does not have permission to delete this user"
	ErrNoPermissionBlock      = "User does not have permission to toggle block status"
	ErrInvalidUserIDs		  = "Invalid user IDs"
	ErrEmptyUserIDs		      = "Empty user IDs"
	ErrFailedToDeleteUsers    = "Failed to delete users"
)

const (
	UserCacheKeyPrefix = "user_session:"
)

// Create new type for the user update request
type UserProfileUpdate struct {
    User      models.User `json:"user"`
}

// Create a struct to match the incoming JSON format
type UserIDsRequest struct {
	UserIDs []string `json:"user_ids"`
}

// PasswordUpdate represents a password update request
type PasswordUpdate struct {
	CurrentPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}