# Api

The api image is a docker image of a go api server. The websocket server fulfills the role of the signaling service in the video calling system.

## The api server

The api server serves as a way for the frontend to query the database. In it's current form it provides information about the identity providers of the calling service itself and identity providers of the ICT tokens.

## The go code

### Notable Dependencies

-   [chi](https://github.com/go-chi/chi) for routing & middleware
-   [logrus](https://github.com/sirupsen/logrus) for leveled logging
-   [pq](https://github.com/lib/pq) for accessing PostgreSQL
-   [viper](https://github.com/spf13/viper) for reading env files

### Structure

The code can be divided into the routing and data base access. Currently no available request requires an elevated role and therefore no authentication mechanism is implemented.

### Routing

Go chi is used to route incoming http requests. There are two routes available.

-   /authProviderInfo
-   /ictProviderInfo

Further documentation for them can be found in the openapi_thesis.yaml file.\

The following middleware is used:

-   Logger
-   RequestID
-   Recoverer
-   cors

### Database access

To access the database login information is required. The public login information is stored as environment variables while the private login information is stored in an .env file that is accessed via viper.\
Queries are send to the database in response to incoming request from the http site. Right now all possible requests do not provide input for the resulting query and queries are prepared functions. \
Instead of keeping the connection alive for the lifetime of the api server every query is done with a new connection.

## The docker image

The docker image uses 3 stages. Stage 1 uses a go:alpine image, installs all dependencies of the webapp and builds the static binary for production. Of note is that both the build and the dependencies are cached to minimize the execution time of the image. Stage 2 extends stage 1 by installing dependencies for a potential development in a Docker-dev-env. Development takes place in stage 2. Stage 3 uses a scratch image and runs the binary from stage 1.

## Future plans

-   Extend the possible API requests

## Possible considerations

-   Cycle api out for a remix approach
