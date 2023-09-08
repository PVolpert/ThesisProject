#!/bin/bash
set -e

source /run/secrets/db-env

# * Create DBs and Users
psql -v ON_ERROR_STOP=1 <<-EOSQL
  -- CREATE DATABASE $WEBAPP_DB;
  -- CREATE USER $API_NAME WITH PASSWORD '$API_PW';
  -- CREATE USER $SIGNALING_NAME WITH PASSWORD '$SIGNALING_PW';
	
  CREATE DATABASE $KEYCLOAK_DB;
  CREATE USER $KEYCLOAK_NAME WITH PASSWORD '$KEYCLOAK_PW';
EOSQL

# psql -v ON_ERROR_STOP=1 --dbname "$WEBAPP_DB"<<-EOSQL
# CREATE TABLE authProviderInfo  (
#     name text PRIMARY KEY ,
#     img text,
#     clientID text,
#     issuer text,
#     redirect text
#                                 );
# CREATE TABLE  ictProviderInfo (
#     name text PRIMARY KEY ,
#     img text,
#     clientID text,
#     issuer text,
#     redirect text
#                                 );

# CREATE FUNCTION authProviderInfoAsJSON () returns jsonb AS
# \$\$
#     -- Turn each row into a json object
#     WITH authProviderInfoObjects AS
#     (SELECT asI.name,row_to_json(asI)  AS object
#     FROM authProviderInfo AS asI),
#     -- Merge all rows into a SQL array
#     authProviderInfoArray AS
#     (SELECT array_agg(object order by name) AS authProviderInfoArray
#     FROM authProviderInfoObjects),
#     -- Transform the SQL array to a JSON array
#     authProviderJSONArray AS
#     (SELECT array_to_json(authProviderInfoArray.authProviderInfoArray)::jsonb AS OIDCProviderInfo
#     FROM authProviderInfoArray)
#     -- Wrap JSON array with an object
#     SELECT row_to_json(authJSON)
#     FROM authProviderJSONArray AS authJSON
# \$\$ LANGUAGE sql IMMUTABLE;

# CREATE FUNCTION ictProviderInfoAsJSON () returns jsonb AS
# \$\$
#     -- Turn each row into a json object
#     WITH ictProviderInfoObjects AS
#     (SELECT asI.name,row_to_json(asI)  AS object
#     FROM ictProviderInfo AS asI),
#     -- Merge all rows into a SQL array
#     ictProviderInfoArray AS
#     (SELECT array_agg(object order by name) AS ictProviderInfoArray
#     FROM ictProviderInfoObjects),
#     -- Transform the SQL array to a JSON array
#     ictProviderJSONArray AS
#     (SELECT array_to_json(ictProviderInfoArray.ictProviderInfoArray)::jsonb AS OIDCProviderInfo
#     FROM ictProviderInfoArray)
#     -- Wrap JSON array with an object
#     SELECT row_to_json(ictJSON)::jsonb
#     FROM ictProviderJSONArray as ictJSON
# \$\$ LANGUAGE sql IMMUTABLE;
# EOSQL

# psql -v ON_ERROR_STOP=1 --dbname "$WEBAPP_DB"<<-EOSQL
# GRANT EXECUTE ON FUNCTION authProviderInfoAsJSON() TO $API_NAME;
# GRANT SELECT ON TABLE authProviderInfo TO $API_NAME;
# GRANT EXECUTE ON FUNCTION ictProviderInfoAsJSON() TO $API_NAME;
# GRANT SELECT ON TABLE ictProviderInfo TO $API_NAME;
# EOSQL

psql -v ON_ERROR_STOP=1 --dbname "$KEYCLOAK_DB"<<-EOSQL
GRANT ALL ON SCHEMA public TO $KEYCLOAK_NAME;
EOSQL


# psql -v ON_ERROR_STOP=1 --dbname "$WEBAPP_DB"<<-EOSQL
# INSERT INTO ictProviderInfo
# WITH jsonICTProviderInfo AS
# (SELECT '[
#   {
#     "name": "ICT-Alpha",
#     "img": "https://raw.githubusercontent.com/keycloak/keycloak-misc/17ac44fcca6f7cc9b07d2ccbd46d702e691805fb/logo/keycloak_icon_32px.svg",
#     "clientId": "thesisProject-ICT-Alpha",
#     "issuer": "http://$OP_HOST/realms/alpha",
#     "redirect": "http://$CLIENT_HOST/auth/redirect/destiny"
#   },
#   {
#     "name": "ICT-Beta",
#     "img": "https://raw.githubusercontent.com/keycloak/keycloak-misc/17ac44fcca6f7cc9b07d2ccbd46d702e691805fb/logo/keycloak_icon_32px.svg",
#     "clientId": "thesisProject-ICT-Beta",
#     "issuer": "http://$OP_HOST/realms/beta",
#     "redirect": "http://$CLIENT_HOST/auth/redirect/desire"
#   },
#   {
#     "name": "ICT-Gamma",
#     "img": "https://raw.githubusercontent.com/keycloak/keycloak-misc/17ac44fcca6f7cc9b07d2ccbd46d702e691805fb/logo/keycloak_icon_32px.svg",
#     "clientId": "thesisProject-ICT-Gamma",
#     "issuer": "http://$OP_HOST/realms/gamma",
#     "redirect": "http://$CLIENT_HOST/auth/redirect/delirium"
#   },

# ]'::jsonb AS start_values),
#      jsonICTProviderInfoRows AS
#          (SELECT ictProviderInfo
#           FROM jsonICTProviderInfo AS aSJ,
#                jsonb_array_elements(asJ.start_values) AS ictProviderInfo)
# SELECT ictProviderInfo ->> 'name'     AS name,
#        ictProviderInfo ->> 'img'      AS img,
#        ictProviderInfo ->> 'clientId' AS clientId,
#        ictProviderInfo ->> 'issuer'   AS issuer,
#        ictProviderInfo ->> 'redirect' AS redirect
# FROM jsonICTProviderInfoRows;

# INSERT INTO authProviderInfo
# WITH jsonAuthProviderInfo AS
# (SELECT '[
#   {
#     "name": "Client",
#     "img": "https://raw.githubusercontent.com/keycloak/keycloak-misc/17ac44fcca6f7cc9b07d2ccbd46d702e691805fb/logo/keycloak_icon_32px.svg",
#     "clientId": "thesisProject-Client",
#     "issuer": "http://$OP_HOST/realms/auth",
#     "redirect": "http://$CLIENT_HOST/auth/redirect/dream"
#   }
# ]'::jsonb AS start_values),
#      jsonAuthProviderInfoRows AS
#          (SELECT authProviderInfo
#           FROM jsonAuthProviderInfo AS aSJ,
#                jsonb_array_elements(asJ.start_values) AS authProviderInfo)
# SELECT authProviderInfo ->> 'name'     AS name,
#        authProviderInfo ->> 'img'      AS img,
#        authProviderInfo ->> 'clientId' AS clientId,
#        authProviderInfo ->> 'issuer'   AS issuer,
#        authProviderInfo ->> 'redirect' AS redirect
# FROM jsonAuthProviderInfoRows;
# EOSQL