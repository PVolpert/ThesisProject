# syntax=docker/dockerfile:1.4

# Create image based on the official Node image from dockerhub
FROM node:alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package-lock.json /usr/src/app
COPY package.json /usr/src/app

# Install dependecies
#RUN npm set progress=false \
#    && npm config set depth 0 \
#    && npm i install
RUN npm ci

# Get all the code needed to run the app
COPY . /usr/src/app

# Build the app
RUN npm run build

# Serve the app
CMD ["npm", "run" ,"dev"]

#* Docker Dev Environment Setup
FROM builder as dev-envs
RUN <<EOF
apk update
apk add git
EOF

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "run", "dev" ]

#* Production
FROM nginx:alpine

COPY --from=builder  /usr/src/app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /usr/src/app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

