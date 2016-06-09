FROM node
MAINTAINER V.V. Aksenchyk <aksenchyk.v@gmail.com>
ADD . /app
WORKDIR /app
RUN \            
    npm install -g typings gulp --depth 0 && \
    npm install --depth 0 && \
    typings install   
RUN gulp build:production

CMD ["npm","start"]