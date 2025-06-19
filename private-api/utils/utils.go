package utils

import (
	"bytes"
	"encoding/json"
	"io"
	"log"

	"github.com/gin-gonic/gin"
)

func DisplayBodyContent(c *gin.Context) {
	// Print the body
	bodyData, _ := io.ReadAll(c.Request.Body)
	log.Printf("Incoming request body: %s", string(bodyData))
	// We need to restore the body for binding
	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyData))
}

func UnmarshalJSON(data []byte, v interface{}) error {
	if err := json.Unmarshal(data, v); err != nil {
		return err
	}
	return nil
}

func MarshalJSON(v interface{}) ([]byte, error) {
	data, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}
	return data, nil
}