package handlers

import (
	"fmt"
	"net/http"

	"api/db"
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
