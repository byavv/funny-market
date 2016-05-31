FROM node:6.2.0
MAINTAINER V.V. Aksenchyk <aksenchyk.v@gmail.com>
WORKDIR /app
ADD . /app
RUN \    
    npm install -g typings gulp --quiet \
    && npm install \
    && typings install \
    && gulp build
CMD ["npm","start"]