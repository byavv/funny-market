FROM node:5.10.1
MAINTAINER V.V. <aksenchyk.v@gmail.com>
ADD . /app
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 5.10.1
RUN \    
    npm install -g typings gulp --quiet \
    && npm install \
    && typings install \
    && gulp build
CMD ["npm","start"]