FROM node:6.2.0
MAINTAINER V.V. Aksenchyk <aksenchyk.v@gmail.com>
WORKDIR /app
ADD . /app

RUN \
    apt-get install make && \  
    && npm cache clear \
    && apt-get update \
    && apt-get install -y

RUN npm install --ignore-scripts --quiet
CMD ["npm","start"]

