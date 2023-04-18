package handlers

import (
	"encoding/json"
	log "github.com/sirupsen/logrus"
	"net/http"
)

// Returns a Handler function that writes the output of the query given that it is json
func buildPureQueryHandler(query func() (resp string, err error)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		query, err := query()
		if err != nil || !json.Valid([]byte(query)) {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
			return
		}
		w.Write([]byte(query))
	}
}
