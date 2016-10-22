FROM quay.io/letsencrypt/letsencrypt:latest

COPY start.sh /

RUN chmod u+x /start.sh

ENTRYPOINT ["/start.sh"]