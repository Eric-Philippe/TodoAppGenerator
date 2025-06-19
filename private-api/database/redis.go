package database

import (
	"api/config"
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var REDIS *redis.Client

// InitRedis initializes the Redis client
func InitRedis() {   
	addr := config.RedisHost
	port := config.RedisPort
	password := config.RedisPassword
	db := config.RedisDB
	
	REDIS = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", addr, port), // Redis address
		Password: password, // Redis Password
		DB:       db,  // Redis DB
		Protocol: 2,  // Connection protocol
	})
}

// RedisSet sets a key value pair in Redis
func RedisSet(key string, value interface{}) {
	ctx := context.Background()
	err := REDIS.Set(ctx, key, value, 0).Err()
	if err != nil {
		panic(err)
	}
}

// RedisGet gets a value from Redis
func RedisGet(key string) string {
	ctx := context.Background()
	val, err := REDIS.Get(ctx, key).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// RedisSetFields sets multiple fields in a Redis hash
func RedisSetFields(key string, fields []string) int64 {
	ctx := context.Background()
	res, err := REDIS.HSet(ctx, key, fields).Result()
	if err != nil {
		panic(err)
	}

	return res
}

// RedisGetField gets a field from a Redis hash
func RedisGetField(key string, field string) string {
	ctx := context.Background()
	val, err := REDIS.HGet(ctx, key, field).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// RedisGetAllFields gets all fields from a Redis hash
func RedisGetAllFields(key string) map[string]string {
	ctx := context.Background()
	val, err := REDIS.HGetAll(ctx, key).Result()
	if err != nil {
		panic(err)
	}
	return val
}

// RedisGetFromStruct gets a struct from Redis
func RedisGetFromStruct(key string, _struct interface{})  interface{} {
	ctx := context.Background()
	err := REDIS.HGetAll(ctx, key).Scan(_struct)
	if err != nil {
		panic(err)
	}

	return _struct
}

// RedisDelete deletes a key from Redis
func RedisDelete(key string) {
	ctx := context.Background()
	err := REDIS.Del(ctx, key).Err()
	if err != nil {
		panic(err)
	}
}

// GetFromCache retrieves data from Redis cache and unmarshals it into the provided target.
func GetFromCache(ctx context.Context, cacheKey string, target interface{}) (bool, error) {
    cachedData, err := REDIS.Get(ctx, cacheKey).Result()
    if err != nil {
        return false, err
    }

    // Unmarshal the cached data into the target
    if err := json.Unmarshal([]byte(cachedData), target); err != nil {
        return false, err
    }

    // Cache hit
    return true, nil
}

// SetToCache stores data in Redis cache.
func SetToCache(ctx context.Context, cacheKey string, value interface{}) error {
    data, err := json.Marshal(value)
    if err != nil {
        return err
    }
    return REDIS.Set(ctx, cacheKey, data, 0).Err()
}

func SetToCacheWithExpiration(ctx context.Context, cacheKey string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return REDIS.Set(ctx, cacheKey, data, expiration).Err()
}