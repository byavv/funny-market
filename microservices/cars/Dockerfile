FROM node:6.0.0
MAINTAINER [aksenchyk.v@gmail.com]
ADD . /app
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.0.0
RUN npm install --quiet 
CMD ["npm","start"]