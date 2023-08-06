# Initial Setup

## Requirements

-   working internet connection
-   docker desktop

## Get the repo & secrets

The project is stored in a github repo. Exception are secrets which are generated via the generate-secrets script.

```shell
$ git clone git@github.com:PVolpert/ThesisProject.git
$ cd ThesisProject
$ ./generate-secrets.sh
```

## Setup ICT

ICT Tokens are not generated via Keycloak but through a go API server. To create valid Tokens that are verifiable by the client. We need to sign tokens with a key that the go server also knows including the KID.

To enable the usage of ICT Tokens you can either follow the original guide from [JonasPrimbs](https://github.com/JonasPrimbs/oidc-e2ea-server/blob/main/docs-dev/environment-setup.md) or use the following guide

### Start Keycloak

```shell
$ docker compose up op -d
```

### Open secret files

In future steps we require secrets from op.env and private.pem and have to pass the kid to ict.env. To prepare for this open all three files. Of note: I personally use Visual Studio Code. If you use another editor switch from `code`.

```shell
$ code ./.secrets/keycloak/op.env
$ code ./.secrets/keycloak/private.pem
$ code ./.secrets/keycloak/ict.env
```

### Add key to Keycloak

1. Login to [keycloak admin console](http://op.localhost/admin) with op.env credentials KEYCLOAK_ADMIN and KEYCLOAK_ADMIN_PASSWORD

2. Switch to [ict realm key providers](http://op.localhost/admin/master/console/#/ict/realm-settings/keys/providers)

3. Select `Add provider`
    - Pick `rsa`
        - Turn `Enable` On
        - Turn `Active` On
        - Paste Key from private.pem into Private RSA Key

### Save KID for ICT-Provider

1. Navigate to [ict realm key list](http://op.localhost/admin/master/console/#/ict/realm-settings/keys)

2. Copy KID and paste to ict.env as value of KID

## Create Keycloak users

To use the project it is necessary for users to authenticate against the webapp and create new ICT Tokens. For that purpose new users must be registered in Keycloak. The project uses two realms. Client and ICT. Client concerns itself with authentication for the webapp while ICT is used to generate new ICT-Tokens. User information can differ from ICT and Client

### Fill the Forms

For new ICT Token users visit
[ICT User](http://op.localhost/admin/master/console/#/ict/users/add-user).
For new Client Token users visit
[Client User](http://op.localhost/admin/master/console/#/auth/users/add-user). Make sure to enable `Email verified`.

### Add Password

1. Navigate to [ICT user list](http://op.localhost/admin/master/console/#/ict/users) or [client user list](http://op.localhost/admin/master/console/#/auth/users)
   Switch to Credentials Tab of the new user
2. Select `Add Password`

# Start up

Now that you have [saved the kid](#start-keycloak) and [created users](#create-keycloak-users) you can start the rest of the compose environment.

```shell
$ docker compose up -d
```

```shell
$ docker compose -f "compose-dev.yaml" up -d
```

You can now navigate to [webapp homepage](client.localhost). See [client](./images/client/) for a more extensive documentation about the webapp.
