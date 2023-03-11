package handlers

import (
	// "api/db"
	"api/db"
	"api/env"
	"encoding/json"
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"
)

func setCORSHeader(w *http.ResponseWriter) {
	var corsEnv string = env.Get("CORS", "http://localhost:80")
	(*w).Header().Set("Access-Control-Allow-Origin", corsEnv)
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Origin")
}

func setJSONHeader(w *http.ResponseWriter) {
	setCORSHeader(w)
	(*w).Header().Set("Content-Type", "application/json")
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeader(&w)
	fmt.Fprintf(
		w, `
          ##         .
    ## ## ##        ==
 ## ## ## ## ##    ===
/"""""""""""""""""\___/ ===
{                       /  ===-
\______ O           __/
 \    \         __/
  \____\_______/

	
Hello from Docker!

`,
	)

}

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
		setJSONHeader(&w)
		w.Write([]byte(query))
	}
}

var GetAuthServerInfoHandler = buildPureQueryHandler(db.QueryAuthServerInfo)
