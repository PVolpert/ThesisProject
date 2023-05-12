# syntax=docker/dockerfile:1.4
# Generate build container
FROM --platform=$BUILDPLATFORM golang:1.20 AS builder

# Create working directory for source files
WORKDIR /code

ENV CGO_ENABLED 1
ENV GOPATH /go
ENV GOCACHE /go-build 

COPY go.mod go.sum ./

RUN --mount=type=cache,target=/go/pkg/mod/cache \
    go mod download

COPY . .

RUN --mount=type=cache,target=/go/pkg/mod/cache \
    --mount=type=cache,target=/go-build \
    go build -a -ldflags '-linkmode external -extldflags "-static"' -o bin/ict main.go

CMD [ "/code/bin/ict" ]

FROM builder as dev-envs

RUN <<EOF
apk update
apk add git
EOF

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF

COPY --from=gloursdocker/docker / /

CMD ["go", "run", "main.go"]

# Generate runtime container
FROM scratch
COPY --from=builder /code/bin/ict /usr/local/bin/ict

# Set default configuration parameters
ENV ALG="ES256"
ENV DEFAULT_TOKEN_PERIOD=3600
ENV MAX_TOKEN_PERIOD=2592000
ENV PORT=8080
ENV DB_SQLITE_FILE="/config/db.sqlite"

CMD ["/usr/local/bin/ict"]
