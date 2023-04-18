package handlers

import (
	// "api/db"
	"api/db"
	// "encoding/json"
	"fmt"
	"net/http"
	// log "github.com/sirupsen/logrus"
)

var GetAuthProviderInfoHandler = buildPureQueryHandler(db.QueryAuthProviderInfo)
var GetICTProviderInfoHandler = buildPureQueryHandler(db.QueryICTProviderInfo)

func DummyHandler(w http.ResponseWriter, r *http.Request) {
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
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
