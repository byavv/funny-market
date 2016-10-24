#!/bin/bash
echo sleep 3
sleep 3

echo build starting nginx config


echo replacing ___DOMAIN_NAME___/$DOMAIN_NAME
echo replacing ___WEB_SERVER_HOST___/$WEB_SERVER_HOST
echo replacing ___WEB_SERVER_PORT___/$WEB_SERVER_PORT
echo replacing ___GATEWAY_SERVER_HOST___/$GATEWAY_SERVER_HOST
echo replacing ___GATEWAY_SERVER_PORT___/$GATEWAY_SERVER_PORT
echo replacing ___LETSENCRYPT_HOST___/$LETSENCRYPT_HOST
echo replacing ___LETSENCRYPT_PORT___/$LETSENCRYPT_PORT

# Put your domain name into the nginx reverse proxy config.
sed -i "s/___DOMAIN_NAME___/$DOMAIN_NAME/g" /etc/nginx/nginx.conf
sed -i "s/___DOMAIN_NAME___/$DOMAIN_NAME/g" /etc/nginx/nginx-secure.conf
sed -i "s/___DOMAIN_NAME___/$DOMAIN_NAME/g" /etc/nginx/system/ssl.conf

# Add your web server's container IP and port into config
sed -i "s/___WEB_SERVER_HOST___/$WEB_SERVER_HOST/g" /etc/nginx/locations/web.conf
sed -i "s/___WEB_SERVER_PORT___/$WEB_SERVER_PORT/g" /etc/nginx/locations/web.conf

# Add your letsencrypt conteiner IP and port into config
sed -i "s/___LETSENCRYPT_HOST___/$LETSENCRYPT_HOST/g" /etc/nginx/locations/letsencrypt.conf
sed -i "s/___LETSENCRYPT_PORT___/$LETSENCRYPT_PORT/g" /etc/nginx/locations/letsencrypt.conf
sed -i "s/___LETSENCRYPT_HOST___/$LETSENCRYPT_HOST/g" /etc/nginx/nginx.conf
sed -i "s/___LETSENCRYPT_PORT___/$LETSENCRYPT_PORT/g" /etc/nginx/nginx.conf

# Add gateway container IP and port into config
sed -i "s/___GATEWAY_SERVER_HOST___/$GATEWAY_SERVER_HOST/g" /etc/nginx/locations/gateway.conf
sed -i "s/___GATEWAY_SERVER_PORT___/$GATEWAY_SERVER_PORT/g" /etc/nginx/locations/gateway.conf

cat /etc/nginx/nginx.conf
echo .
echo Firing up nginx in the background.
nginx

# Check user has specified domain name
if [ -z "$DOMAIN_NAME" ]; then
    echo "Need to set DOMAIN_NAME (to a letsencrypt-registered name)."
    exit 1
fi

# This bit waits until the letsencrypt container has done its thing.
# We see the changes here bceause there's a docker volume mapped.


echo Waiting for folder /etc/letsencrypt/live/$DOMAIN_NAME to exist
while [ ! -d /etc/letsencrypt/live/$DOMAIN_NAME ] ;
do
    sleep 2
done

while [ ! -f /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem ] ;
do
	echo Waiting for file fullchain.pem to exist
    sleep 2
done

while [ ! -f /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem ] ;
do
	echo Waiting for file privkey.pem to exist
    sleep 2
done


#go!
kill $(ps aux | grep '[n]ginx' | awk '{print $2}')
cp /etc/nginx/nginx-secure.conf /etc/nginx/nginx.conf

nginx -g 'daemon off;'