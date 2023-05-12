package handlers

import (
	"encoding/json"
	"net/http"

	log "github.com/sirupsen/logrus"
)

func setJSONHeader(w *http.ResponseWriter) {
	(*w).Header().Set("Content-Type", "application/json")
}

// Returns a Handler function that writes the output of the query given that it returns JSON
func buildPureQueryHandler(query func() (resp string, err error)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		query, err := query()
		if err != nil || !json.Valid([]byte(query)) {
			log.Error(err)
			http.Error(w, QueryError.ToJSONString(), http.StatusInternalServerError)
			return
		}

		setJSONHeader(&w)
		w.Write([]byte(query))
	}
}
