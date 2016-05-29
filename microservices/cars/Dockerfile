FROM node:6.2.0
MAINTAINER V.V. Aksenchyk <aksenchyk.v@gmail.com>
WORKDIR /app
ADD . /app
RUN apt-get install make && \
    npm install --ignore-scripts --quiet
CMD ["npm","start"]