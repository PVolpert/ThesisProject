# syntax=docker/dockerfile:1.4

FROM node AS builder

RUN <<EOF
apt update
apt install pip -y
EOF

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm ci

COPY . /usr/src/app

RUN npm run build

CMD [ "npm", "run", "start" ]

FROM builder as dev-envs
RUN <<EOF
apt update
apt install git
EOF
RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "run", "dev" ]

FROM node
RUN <<EOF
apt update
apt install pip -y
EOF
WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
COPY --from=builder /usr/src/app/build ./build

RUN npm ci --production

CMD ["npm", "run", "start"]