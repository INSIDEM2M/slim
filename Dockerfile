FROM node:8

RUN mkdir -p /usr/lib/slim-cli
RUN chown node:node /usr/lib/slim-cli

WORKDIR /usr/lib/slim-cli

RUN git clone https://github.com/INSIDEM2M/slim.git .

# FIXME: DONT USE ^ WHEN DECLARING DEPENDENCIES!!!
RUN sed -i 's/\"\: \"\^/\"\: \"\~/g' package.json
RUN rm package-lock.json

RUN npm install --quiet --no-progress --unsafe
RUN npm run build
RUN npm link

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

WORKDIR /usr/src/app

CMD /bin/bash