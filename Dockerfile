FROM node:8

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

WORKDIR /usr/src/app

RUN npm install --quiet --production --no-progress --unsafe --global slim-cli