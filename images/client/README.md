# Client Image

The client image is a docker image of a react frontend webapp made using create-react-app. The webapp serves as the frontend call service of the video calling system.

## The webapp

The webapp is a multi page application and the pages are divided into two branches.

-   HomePage & MainNavigation
    -   Auth Branch (token --> redirects to Call Page)
        -   **Login Page**
        -   Redirect Pages
    -   Call Branch (no token --> redirects to Login Page)
        -   **Call Page**
        -   P2P Page
        -   Conference Page

### On initial visit

On the first visit the user sees the homepage. Right now the page is blank. Future plans for the homepage are to add a walkthrough.
All pages have access to the main navigation. The main navigation contains the list of accessible sites and for authenticated users the connection state to the signaling server, account name, options for the video call and the logout button.
Initially the **call branch** can not be accessed and is not available in the main navigation. All attempts to access the call branch are redirected to the Login Page.

### Logging in

Users can login to the app thourgh the Login Page. To authenticate users a OIDC authcode flow is used. Focus of the **auth branch** is the acquisition of a valid OIDC Token from one of the call service identity providers and storing the token in local storage. The users can choose one identity provider and is then redirected to the
Upon receiving the token the user can access the call branch but can no longer access the auth branch unless the token expires or the user logs out.

### Call Page

Upon a successful login the user is redirected to the call page. Here the user can see other active users in the sidebar and is able to call them. Additionally the user can log into the supported ICT-Token identity providers. In the future the user will also be able to enter into a conference call.\
In addition the user can now enable and disable video and audio in video calls through the options in the main navigation.

### Signaling Server

The successful login also starts the connection to the signaling server via websocket. User can now receive and send calls. Users are determined to be online if they have an active connection to the signaling server. The current connection state is shown in the main navigation.

### Calling & Receiving a Call

Calling another user is done through clicking the call button on the sidebar of the Call Page which also redirect the calling user (hereafter caller) to the P2P Page. If the called user (hereafter callee) is not already in a call the callee is notified and can accept or deny the call. If accepted the callee switches to the P2P Page where the connection between callee and caller gets established. If denied the caller receives a hangup message and is redirected to the call page.

## The React Part

### Notable Dependencies

-   [React Router](https://reactrouter.com) for routing
-   [Zustand](https://github.com/pmndrs/zustand) for State Management & Local Storage
-   [React-use-websocket](https://www.npmjs.com/package/react-use-websocket) for websockets hooks
-   [Tailwind](https://tailwindcss.com/) for layout
-   [oauth4webapi](https://www.npmjs.com/package/oauth4webapi) for OIDC token handling

### Structure

The code is divided into the following parts:

-   Components

    -   Contains all the React Components
    -   each Page has a separate folder
    -   Division of component logic and display logic

-   Hooks

    -   Contains all custom hooks

-   Pages

    -   Contains all pages of the webapp
    -   loader & page logic
    -   Route protection via useToken

-   Stores

    -   Contains all global state management logic
    -   Immutable State Management: Zustand
    -   Single store with slices (flux-like)

-   Wrappers
    -   Contains all non react helper functions
    -   Auth: Handles OIDC Token Acquisition
    -   Signaling: Handles Signaling Server

### Authentication

Upon visiting the Login Page the necessary information for an auth code flow is prepared for all identity providers and presented as buttons. Clicking the Button redirects the user to identity provider where they can login. After the successful login the user is redirected to the redirect page of the webapp. Here the redirect page finds the correct identity provider and starts the steps of the oauth4webapi auth code flow that returns the token.
The token now gets stored in the zustand store which in turn stores it in local storage.

The**useToken** hook is used in the webapp to manage the token state. Functions of useToken are

-   Route protection
-   Token in Compact From
-   Token in Full JSON
-   Socket URL
-   Token validation

### The Socket Connection

### The WebRTC Connection

The goal was it to have a similar flow like [MDN's](). The additional Challenge for a multi page application comes with the fact that not all components are active at the same time.
To enable listening for incoming calls from everywhere the component must always be active. Main navigation is the only component that is globally active. As such the component that listens for incoming calls is in main navigation. If a incoming call is accepted the **offer** of the incoming call is set in zustand and the webapp redirects to the P2P Page.\
Like mentioned above to initate a call the call button for an active user in the Call Page sidebar must be clicked. The **target** is set in zustand and the page redirect to the P2P Page.\
The P2P Page itself contains the **useRTCPeerHook** that handles the complete WebRTC connection process and provides the MediaStream of the local Media and the MediaStream of the remote Media. useRTCPeerHook uses the following steps to establish a connection between the call partners

1. See if there is a target or offer
2. Create a RTCPeerConnection
3. Attach Event Handlers to connection
4. If target start active call
    1. Get local media according to options
    2. Attach local media to RTCPeerConnection
    3. Trigger onNegotiationNeeded
    4. Create offer & set local description
    5. Send to target & wait for answer
    6. Send trickle ice messages
    7. Incoming Answer--> set remoteDescription
    8. Add incoming ice messages to RTCPeerConnection
5. If offer start passive call
    1. Set RemoteDescription
    2. Get local media according to option
    3. Attact localMedia to RTCPeerConnection
    4. Set localDescription & Create answer
    5. Handle incoming ice messages
    6. Send trickle ice messages

The P2P Page takes the MediaStreams from the hook and attaches it to video elements referenced by a ref.

## The docker image

The docker image uses 3 stages. Stage 1 uses a node:alpine image, installs all dependencies of the webapp and builds the static assets for production. Stage 2 extends stage 1 by installing dependencies for a potential development in a Docker-dev-env. Development takes place in stage 2. Stage 3 uses a nginx:alpine image and deploys the build static assets from stage 1 using a nginx web server.

## Future plans

-   Layout overhaul using tailwind
-   ICT-Token flow
-   P2P Video mute&close Video
-   Conference calls

## Considerations

-   use Remix
