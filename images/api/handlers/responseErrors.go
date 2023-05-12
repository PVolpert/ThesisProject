package handlers

import (
	"encoding/json"

	log "github.com/sirupsen/logrus"
)

type ResponseError struct {
	Code    string `json:"error"`
	Message string `json:"message"`
}

func (respErr *ResponseError) ToJSONString() string {
	jsonBytes, err := json.Marshal(respErr)
	if err != nil {
		log.Error(err)
		return ""
	}
	return string(jsonBytes)
}

var (
	QueryError ResponseError = ResponseError{"DB100", "Could not handle query"}
)
