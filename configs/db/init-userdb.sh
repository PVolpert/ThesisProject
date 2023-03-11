#!/bin/bash
set -e

source /run/secrets/db-env

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE $webapp_dbname;
  CREATE USER $api_name WITH PASSWORD '$api_pw';
EOSQL


psql -v ON_ERROR_STOP=1 --dbname "$webapp_dbname"<<-EOSQL
CREATE TABLE authServerInfo (
    name text PRIMARY KEY ,
    img text,
    clientID text,
    issuer text,
    redirect text
);

INSERT INTO authServerInfo
WITH authServerInfoJSON As (SELECT '[
  {
    "name": "Keycloak",
    "img": "https://www.svgrepo.com/download/331455/keycloak.svg",
    "clientID": "demoReact",
    "issuer": "http://op.localhost/realms/iat",
    "redirect": "http://localhost:2000/auth/redirect/destiny"
  }
]'::jsonb as start_values),
     authServerInfoRowsJSON as
         (SELECT authServer
          FROM authServerInfoJSON as aSJ,
               jsonb_array_elements(asJ.start_values) as authServer)
SELECT authServer ->> 'name' as     name,
       authServer ->> 'img' as      img,
       authServer ->> 'clientID' as clientID,
       authServer ->> 'issuer' as   issuer,
       authServer ->> 'redirect' as redirect
FROM authServerInfoRowsJSON;

CREATE FUNCTION authServerInfoAsJSON () returns jsonb AS
\$\$
    WITH authServerInfoObjects as
    (SELECT name,row_to_json(asI)  as object
    FROM authServerInfo as asI),
    authServerInfoArray AS
    (SELECT array_agg(object order by name) as authServerInfoArray
    FROM authServerInfoObjects)
    SELECT array_to_json(authServerInfoArray.authServerInfoArray)::jsonb
    FROM authServerInfoArray
\$\$ LANGUAGE sql IMMUTABLE;
GRANT EXECUTE ON FUNCTION authServerInfoAsJSON() TO $api_name;
GRANT SELECT ON TABLE authServerInfo TO $api_name;
EOSQL