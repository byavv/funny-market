FROM node:5.10.1
MAINTAINER [aksenchyk.v@gmail.com]
ADD . /app
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 5.10.1
RUN npm install --quiet 
CMD ["npm","start"]
