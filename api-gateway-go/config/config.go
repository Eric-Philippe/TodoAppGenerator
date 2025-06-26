package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	PublicAPIURL   string
	PrivateAPIURL  string
	Environment    string
	LogLevel       string
	RateLimitMax   int
	RateLimitWindow int
}

func LoadConfig() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	config := &Config{
		Port:           getEnv("PORT", "5000"),
		PublicAPIURL:   getEnv("PUBLIC_API_URL", "http://localhost:5050"),
		PrivateAPIURL:  getEnv("PRIVATE_API_URL", "http://localhost:5555"),
		Environment:    getEnv("ENVIRONMENT", "development"),
		LogLevel:       getEnv("LOG_LEVEL", "info"),
		RateLimitMax:   getEnvAsInt("RATE_LIMIT_MAX", 100),
		RateLimitWindow: getEnvAsInt("RATE_LIMIT_WINDOW", 60),
	}

	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
