# Signaling

The signaling image is a docker image of a go websocket server. The websocket server fulfills the role of the signaling service in the video calling system.

## The Signaling Server

### Authentication

Authentication is done via offline verification of a OIDC token issued by on of the supplied oidc providers.\
The client connects to the server with a request containing an valid OIDC Authentication Token in the path query.

### Connecting to the Websocket

Upon the successful verification of the token the server establishes the websocket connection. The user is added to the list of active subscribers and an message is send to all other active subscribers notifying them that the user is online.

### Using the Websocket

The user can now request a userlist to get all active users and can track userOnline and userOffline messages to keep the list up to date. \
Given a target the user can send signaling messages to initiate a WebRTC call or listen for incoming signaling messages from other users. The signaling server itself only relays signaling messages.

## The Go Part

### Notable Dependencies

-   [chi](https://github.com/go-chi/chi) for routing & middleware
-   [logrus](https://github.com/sirupsen/logrus) for leveled logging
-   [nhooyr.io/websocket](https://github.com/nhooyr/websocket) for gorilla-free websockets
-   [ctxValueBuilder](https://github.com/PVolpert/ctxValueBuilder) for context management
-   [oidcauth](https://github.com/PVolpert/oidcauth) for oidc verification

### Structure

The code can be divided into the signaling server containing the establishment of a websocket connection and reacting to actions of an active connection, the routing part which listens for incoming http request and the authenticating part which verifies tokens and passes valid connections to the signaling server

### Routing

Go chi is used to route incoming http request. There is only one route available: The socket route on /. The following middleware is used:

-   Logger
-   RequestID
-   Recoverer
-   cors

### Authenticating

On start of the image the information of all issuers mentioned in the oidcauth offline (slice) is collected. In the current setup the used identity providers are part of the internal compose network. Therefore the address for the identity providers for the signaling server defer from the address for outside sources. To solve this issue an outside issuer must be set for each identity provider.\
Incoming requests are probed for a token in either the header, a cookie or the path query.\
The token gets verified by the oidcauth Verification and Auth middleware and the token is stored in the context. Request with missing or invalid tokens are rejected and do not continue to the socket.\

### Signaling Server

The actual signaling server is a struct that contains all variables and methods needed for handling socket connection.
Upon receiving a new connection the user is added to a map of subscribers.
As key the userid, a combination of issuer (iss field) and subject identifier (sub field), is used. As value a message channel as well as the preferred_username claim is used.
The websocket connection is kept alive through the usage of a loop. As there are no events in go the socket connection is controlled by a Select statement that wait for the following:

-   The user sends a message --> Handle message
-   message in message channel --> Send message
-   The websocket is closed from the outside

The loop is broken if either a action returns an error or the websocket is closed from the outside.

### Messages

Users can send messages to the signaling server in a JSON-Format.
A message can have the following fields

-   **type**: string; required
-   **target**: userId
-   **origin**: userId
-   **body**: any

Messages are not directly send to users but are first stored in the message channel of the user. To prevent bursting messages the send rate to one user is limited to one message per 100ms.

### Message Types

The message types are divided into user management messages and signaling messages. Usermanagement messages send their user information in the form of a userInfo struct which is a userId struct with an added username field.

-   User management
    -   userList
        -   in: type
        -   out: type, body : users
        -   Provides full list of active users to sender
    -   userOffline
        -   out: type, body : user
        -   notifies the user that another user is now offline
        -   broadcast
        -   only send by signaling server
    -   userOnline
        -   out: type, body : user
        -   broadcast
        -   notifies the user that another user is now online
        -   only send by signaling server
-   Signaling
    -   in: type, target, body : any
    -   out: type, origin, body : any
    -   relays the message to target

## The docker image

The docker image uses 3 stages. Stage 1 uses a go:alpine image, installs all dependencies of the webapp and builds the static binary for production. Of note is that both the build and the dependencies are cached to minimize the execution time of the image. Stage 2 extends stage 1 by installing dependencies for a potential development in a Docker-dev-env. Development takes place in stage 2. Stage 3 uses a scratch image and runs the binary from stage 1.

## Future plans

-   Sanitize messages
-   Access control socket
-   Multicast for Conference

## Possible considerations

-   Evil Signaling Server
-
