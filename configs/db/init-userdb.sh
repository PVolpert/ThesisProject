#!/bin/bash
set -e

source /run/secrets/db-env

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE $webapp_dbname;
  CREATE USER $api_name WITH PASSWORD '$api_pw';
EOSQL

psql -v ON_ERROR_STOP=1 --dbname "$webapp_dbname"<<-EOSQL
CREATE TABLE authProviderInfo  (
    name text PRIMARY KEY ,
    img text,
    clientID text,
    issuer text,
    redirect text
                                );
CREATE TABLE  ictProviderInfo (
    name text PRIMARY KEY ,
    img text,
    clientID text,
    issuer text,
    redirect text
                                );

INSERT INTO ictProviderInfo
WITH jsonICTProviderInfo AS
(SELECT '[
  {
    "name": "Keycloak ICT",
    "img": "https://www.svgrepo.com/download/331455/keycloak.svg",
    "clientId": "thesisProject-Client-ICT",
    "issuer": "http://op.localhost/realms/ict",
    "redirect": "http://localhost:2000/auth/redirect/destiny"
  }
]'::jsonb AS start_values),
     jsonICTProviderInfoRows AS
         (SELECT ictProviderInfo
          FROM jsonICTProviderInfo AS aSJ,
               jsonb_array_elements(asJ.start_values) AS ictProviderInfo)
SELECT ictProviderInfo ->> 'name'     AS name,
       ictProviderInfo ->> 'img'      AS img,
       ictProviderInfo ->> 'clientId' AS clientId,
       ictProviderInfo ->> 'issuer'   AS issuer,
       ictProviderInfo ->> 'redirect' AS redirect
FROM jsonICTProviderInfoRows;

INSERT INTO authProviderInfo
WITH jsonAuthProviderInfo AS
(SELECT '[
  {
    "name": "Keycloak Auth",
    "img": "https://www.svgrepo.com/download/331455/keycloak.svg",
    "clientId": "thesisProject-Client",
    "issuer": "http://op.localhost/realms/auth",
    "redirect": "http://localhost:2000/auth/redirect/morpheus"
  }
]'::jsonb AS start_values),
     jsonAuthProviderInfoRows AS
         (SELECT authProviderInfo
          FROM jsonAuthProviderInfo AS aSJ,
               jsonb_array_elements(asJ.start_values) AS authProviderInfo)
SELECT authProviderInfo ->> 'name'     AS name,
       authProviderInfo ->> 'img'      AS img,
       authProviderInfo ->> 'clientId' AS clientId,
       authProviderInfo ->> 'issuer'   AS issuer,
       authProviderInfo ->> 'redirect' AS redirect
FROM jsonAuthProviderInfoRows;

CREATE FUNCTION authProviderInfoAsJSON () returns jsonb AS
\$\$
    WITH authProviderInfoObjects AS
    (SELECT asI.name,row_to_json(asI)  AS object
    FROM authProviderInfo AS asI),
    authProviderInfoArray AS
    (SELECT array_agg(object order by name) AS authProviderInfoArray
    FROM authProviderInfoObjects)
    SELECT array_to_json(authProviderInfoArray.authProviderInfoArray)::jsonb
    FROM authProviderInfoArray
\$\$ LANGUAGE sql IMMUTABLE;

CREATE FUNCTION ictProviderInfoAsJSON () returns jsonb AS
\$\$
    WITH ictProviderInfoObjects AS
    (SELECT asI.name,row_to_json(asI)  AS object
    FROM ictProviderInfo AS asI),
    ictProviderInfoArray AS
    (SELECT array_agg(object order by name) AS ictProviderInfoArray
    FROM ictProviderInfoObjects)
    SELECT array_to_json(ictProviderInfoArray.ictProviderInfoArray)::jsonb
    FROM ictProviderInfoArray
\$\$ LANGUAGE sql IMMUTABLE;
GRANT EXECUTE ON FUNCTION authProviderInfoAsJSON() TO $api_name;
GRANT SELECT ON TABLE authProviderInfo TO $api_name;
GRANT EXECUTE ON FUNCTION ictProviderInfoAsJSON() TO $api_name;
GRANT SELECT ON TABLE ictProviderInfo TO $api_name;
EOSQL