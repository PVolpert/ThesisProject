# Signaling

Signaling server of the thesis project.

## How it works

### 1. Authentication

The client connects to the server with a request containing an valid OIDC Authentication Token. The token gets verified by the oidcauth Verification and Auth middleware. Valid requests have the token value in their context. For further steps the combination of issuer (iss field) and subject identifier (sub field) are used as identifiers for a user.

### 2. Connecting to the Websocket

Upon the successful verification of the token the server establishes the websocket.
