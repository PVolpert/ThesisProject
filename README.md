# Thesis Project

This is the repository for my master thesis project.
Goal of the thesis is to develop a prototype that demonstrates how OIDC^2 can be used to provide E2E Authentication/Encryption for WebRTC calls through the usage of [ICT Tokens](https://github.com/JonasPrimbs/draft-ietf-mla-oidc/blob/main/docs/draft.md).

## How does this project work

The project consists of all the necessary parts to host 1-1 calls with vanilla WebRTC and conference calls with mediasoup.

### Topology

Main focus of the project is the docker compose environment provided by compose.yaml for a production-style setup and compose-dev.yaml for a development-style setup. To connect to the outside a [traefik api](./configs/traefik/) gateway is used. Other than that the following images are used:

-   [client](./images/client/)
    -   Provides the React webapp
    -   Reachable via client.localhost
    -   Dev: React Dev Server
    -   Prod: Nginx Server with static assets
    -   might become a remix server in the future
-   [api](./images/api/)
    -   Provides the general api
    -   Reachable via api.localhost
    -   Dev: Go image
    -   Prod: Scratch with static binary from go build
    -   might be replaced with remix
-   [signaling](./images/signaling/)
    -   Signaling server for WebRTC & user management
    -   Reachable via signaling.localhost
    -   Dev: Go image
    -   Prod: Scratch with static binary from go build
-   [backend](./images/backend/)
    -   SFU via mediasoup
    -   unfinished
-   [db](./configs/db/)
    -   PostgreSQL image
    -   individual roles & rights
-   [op](./configs/op)
    -   Keycloak image
    -   Seperate realm for ICT & client
-   [ict](./configs/ict)
    -   ICT Token Provider
    -   see [JonasPrimbs' implementation]()

Of note: Right now the project only runs on localhost and therefore does not require TLS/SSL. For a remote deployment accessible via the internet TLS/SSL certification must be implemented.

### Environment variables & secrets

To provide non-secret environment variables the [configs](./configs/) directory is used. Each image has it's own directory containg a config.env file. To provide a single source of truth each overlapping environment variable is stored in the [.env](./.env) file.

Secret environment variables like usernames and passwords are stored in the .secrets directory that is only stored locally. For new projects the [generate-secrets.sh](./generate-secrets.sh) provides a way to generate a fresh batch of secrets.

## Target Audience

Primary target audience for the project is the academical community and developers searching for a way to truly E2E secure WebRTC connections. Secondary target audience are potential future employers of mine that review this project as part of my portfolio ; ).

## Goal

The goal of the project is to provide a prototype for a system that provides a video calling system that is protected through the usage of ICT Tokens against these attacks:

-   Caller/-ee identity
-   Signaling Server MitM
-   SFU Eavesdropping

## Benefits

The project itself is only a prototype of what could be and only provides the benefit of demonstrating the idea.
The idea is to provide users a way to identify their call partners and secure them and their connection even if they use untrusted video call infrastructure.

# How to...

## Use

Please keep in mind that this is a prototype and should therefore never be used in a production scenario.
To use the project for the first time follow the [how to use guide](./HOWTOUSE.md) for a step-by-step setup.

## Test

Currently no testing is provided. As this is a solely a prototype never intended for use in a production environment a TDD-strategy is over the top. If there is time before the end of my thesis, testing will be included.

## Develop

As this is a thesis project I do not allow other users to make changes. Of course you are free to fork this project provided you comply with the license.

# Showcase

The following technologies are showcased in this project

-   [React](https://reactjs.org/)
    -   Frontend application
    -   routing via [react-router](https://reactrouter.com/en/main)
    -   state management via [zustand](https://github.com/pmndrs/zustand)
    -   OIDC Auth Code flow via [oauth4webapi](https://github.com/panva/oauth4webapi)
    -   1to1 video calls via [vanilla WebRTC](https://webrtc.github.io/samples/src/content/peerconnection/channel/)
    -   Conference calls via [mediasoup](https://github.com/versatica/mediasouphttps://github.com/versatica/mediasoup)
-   [Go](https://go.dev/)
    -   Backend API
    -   Routing via [go-chi](https://github.com/go-chi/chi)
    -   Websockets via [nhooyr/ws](https://github.com/nhooyr/websocket)
    -   OIDC Token Handling
    -   Postgres Support
-   [Postgres](https://www.postgresql.org/)
    -   Database
    -   User management
    -   Functions
    -   JSON format responses
-   [Docker](https://www.docker.com)
    -   State of the art Dockerfile design
    -   Support for [Docker Development Environments](https://docs.docker.com/desktop/dev-environments/)
    -   State of the art Compose design
