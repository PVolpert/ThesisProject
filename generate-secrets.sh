#!/bin/bash

SECRETS_DIR="./.secrets"
DB_DIR="${SECRETS_DIR}/db"
KEYCLOAK_DIR="${SECRETS_DIR}/keycloak"

# * DB ENVS
DB_PASSWORD_FILE="${DB_DIR}/password.txt"
API_USER_FILE="${DB_DIR}/api.txt"
KEYCLOAK_USER_FILE="${DB_DIR}/keycloak.txt"
SIGNALING_USER_FILE="${DB_DIR}/signaling.txt"
DB_ENVSCRIPT_FILE="${DB_DIR}/env.sh"

# * KEYCLOAK ENVS
PRIVATE_KEY_ALPHA_FILE="${KEYCLOAK_DIR}/alpha.pem"
PRIVATE_KEY_BETA_FILE="${KEYCLOAK_DIR}/beta.pem"
PRIVATE_KEY_GAMMA_FILE="${KEYCLOAK_DIR}/gamma.pem"
ICT_ALPHA_ENV_FILE="${KEYCLOAK_DIR}/ict-alpha.env"
ICT_BETA_ENV_FILE="${KEYCLOAK_DIR}/ict-beta.env"
ICT_GAMMA_ENV_FILE="${KEYCLOAK_DIR}/ict-gamma.env"
OP_ENV_FILE="${KEYCLOAK_DIR}/op.env"

# shellcheck source=.env
source .env


# $1 = secret length
function generate_secret {
    head /dev/urandom | tr -dc A-Za-z0-9 | head -c "$1"
}
# $1 = name length
function generate_name {
    head /dev/urandom | tr -dc a-z | head -c "$1"
}





# * Create directories STEP
# Create secrets directory if not exists
mkdir -p "$SECRETS_DIR"
# Create db subdirectory if not exists
mkdir -p "$DB_DIR"
# Create keycloak subdirectory if not exists
mkdir -p "$KEYCLOAK_DIR"

# * Create db files STEP

# Create DB password secret file if not exists
if [ ! -f "$DB_PASSWORD_FILE" ]
then
 generate_secret 64 > $DB_PASSWORD_FILE
fi 




# Generate db username and pw for api; Add db name from .env
# if [ ! -f "$API_USER_FILE" ]
# then
#     {
#     echo "# This file is auto-generated. Do not change contents" 
#     echo "API_NAME=$(generate_name 14)" 
#     echo "API_PW=$(generate_secret 64)" 
#     echo "WEBAPP_DB=${DB_WEBAPP}"
#     } >> "$API_USER_FILE"
# fi
# Generate db username and pw for signaling server; Add db name from .env
# if [ ! -f "$SIGNALING_USER_FILE" ]
# then
#     {
#     echo "# This file is auto-generated. Do not change contents" 
#     echo "SIGNALING_NAME=$(generate_name 14)" 
#     echo "SIGNALING_PW=$(generate_secret 64)" 
#     echo "WEBAPP_DB=${DB_WEBAPP}"
#     } >> "$SIGNALING_USER_FILE"
# fi

# * Generate for global scope
KEYCLOAK_NAME=$(generate_name 14)
KEYCLOAK_PW=$(generate_secret 64)

# Generate db username and pw for keycloak; Add db name from .env
if [ ! -f "$KEYCLOAK_USER_FILE" ]
then
    {
    echo "# This file is auto-generated. Do not change contents" 
    echo "KEYCLOAK_NAME=$KEYCLOAK_NAME" 
    echo "KEYCLOAK_PW=$KEYCLOAK_PW" 
    echo "KEYCLOAK_DB=${DB_KEYCLOAK}"
    } >> "$KEYCLOAK_USER_FILE"
fi

# Generate Central Source File
if [ ! -f "$DB_ENVSCRIPT_FILE" ]
then
    {
    echo "#!/bin/bash"
    echo "# This file is auto-generated. Do not change contents" 
    # echo "source /run/secrets/db-user-api" 
    # echo "source /run/secrets/db-user-signaling" 
    echo "source /run/secrets/db-user-keycloak" 
    } >> "$DB_ENVSCRIPT_FILE"
fi

# * Create keycloak files STEP
# Create private key file if not exists
[ ! -f "$PRIVATE_KEY_ALPHA_FILE" ] && openssl genrsa -out "$PRIVATE_KEY_ALPHA_FILE" 2048
[ ! -f "$PRIVATE_KEY_BETA_FILE" ] && openssl genrsa -out "$PRIVATE_KEY_BETA_FILE" 2048
[ ! -f "$PRIVATE_KEY_GAMMA_FILE" ] && openssl genrsa -out "$PRIVATE_KEY_GAMMA_FILE" 2048


# Write DB username + password to op.env file
if [ ! -f "$OP_ENV_FILE" ]
then
    {
    echo "# This file is auto-generated. Do not change contents"
    echo "KC_DB_USERNAME=$KEYCLOAK_NAME"
    echo "KC_DB_PASSWORD=$KEYCLOAK_PW"
    echo "KEYCLOAK_ADMIN=$(generate_secret 14)"
    echo "KEYCLOAK_ADMIN_PASSWORD=$(generate_secret 64)"
    } >> "$OP_ENV_FILE"
fi

# Write empty key ID to ict.env file
[ ! -f "$ICT_ENV_ALPHA_FILE" ] && echo "KID=" > "$ICT_ALPHA_ENV_FILE"
[ ! -f "$ICT_ENV_BETA_FILE" ] && echo "KID=" > "$ICT_BETA_ENV_FILE"
[ ! -f "$ICT_ENV_GAMMA_FILE" ] && echo "KID=" > "$ICT_GAMMA_ENV_FILE"