FROM nginx

MAINTAINER aksenchyk viacheslav "<aksenchyk.v@gmail.com"

COPY nginx.conf /etc/nginx/
COPY nginx-secure.conf /etc/nginx/
COPY system/ /etc/nginx/system/
COPY locations/ /etc/nginx/locations

COPY start.sh /
COPY wait-for-it.sh /

RUN chmod u+x /start.sh
RUN chmod u+x /wait-for-it.sh

CMD /start.sh