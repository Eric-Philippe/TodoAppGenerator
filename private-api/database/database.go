package database

import (
	"fmt"
	"log"
	"time"

	"api/config"
	"api/models"
	"api/utils"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB
var DefaultPassword = "admin"

// InitDB initializes the database connection and migrates the models and populates the database with default values if needed
func InitDB() {
	dsn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable TimeZone=Europe/Paris", config.PostgresHost, config.PostgresPort, config.PostgresUser, config.PostgresDB, config.PostgresPassword)

	// Create a custom logger for GORM that records metrics
	newLogger := logger.New(
		log.New(log.Writer(), "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: false,
			Colorful:                  true,
		},
	)

	var gormConfig *gorm.Config
	if config.Env == "production" {
		gormConfig = &gorm.Config{
			Logger: newLogger,
		}
	} else {
		gormConfig = &gorm.Config{}
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	// Migrate the schema first
	err = DB.AutoMigrate(
		&models.User{},
	)
	if err != nil {
		log.Fatal("failed to migrate database: ", err)
	}

	// Populate after successful migration
	Populate()
}

// Populate populates the database with default values if needed
func Populate() {
	var countUser int64

	// Check if there is no role and no user in the database
	DB.Model(&models.User{}).Count(&countUser)
	if countUser == 0 {
		// Create default user admin with a default hashed password either from the .env file or the DefaultPassword constant
		password := DefaultPassword
		if config.DefaultPassword != "" {
			password = config.DefaultPassword
		}

		password, err := utils.HashPassword(password)
		if err != nil {
			panic(err)
		}

		user := models.User{
			Email:        "admin@admin.com",
			Firstname:   "Admin",
			Lastname:    "Admin",
			Password:     password,
			LastConnected: nil,
		}
		DB.Create(&user)
		log.Println("Default user admin created")
	}
}