#!/bin/bash

echo sleep 3
sleep 3

set -e


if [ -z "$DOMAINS" ] ; then
  echo "No domains set, please fill -e 'DOMAINS=example.com www.example.com'"
  exit 1
fi

if [ -z "$EMAIL" ] ; then
  echo "No email set, please fill -e 'EMAIL=your@email.tld'"
  exit 1
fi

# if [ -z "$WEBROOT_PATH" ] ; then
#   echo "No webroot path set, please fill -e 'WEBROOT_PATH=/tmp/letsencrypt'"
#   exit 1
# fi

DARRAYS=(${DOMAINS})
echo "[INFO] Require sertificates for domain: $DARRAYS"
EMAIL_ADDRESS=${EMAIL}
echo "[INFO] EMAIL: $EMAIL"
LE_DOMAINS=("${DARRAYS[*]/#/-d }")
exp_limit="${EXP_LIMIT:-30}"
check_freq="${CHECK_FREQ:-30}"

le_fixpermissions() {
    echo "[INFO] Fixing permissions"
    chown -R ${CHOWN:-root:root} /etc/letsencrypt
    find /etc/letsencrypt -type d -exec chmod 755 {} \;
    find /etc/letsencrypt -type f -exec chmod ${CHMOD:-644} {} \;
}

le_renew() {
    #certbot certonly --webroot --agree-tos --renew-by-default --text --email ${EMAIL_ADDRESS} ${LE_DOMAINS}
    certbot certonly --standalone ${LE_DOMAINS} --text --agree-tos --email ${EMAIL_ADDRESS} --server https://acme-v01.api.letsencrypt.org/directory --rsa-key-size 4096 --verbose --renew-by-default --standalone-supported-challenges http-01
    le_fixpermissions    
}

le_check() {
    cert_file="/etc/letsencrypt/live/$DARRAYS/fullchain.pem"
    
    if [ -f $cert_file ]; then
    
        exp=$(date -d "`openssl x509 -in $cert_file -text -noout|grep "Not After"|cut -c 25-`" +%s)
        datenow=$(date -d "now" +%s)
        days_exp=$[ ( $exp - $datenow ) / 86400 ]
        
        echo "Checking expiration date for $DARRAYS..."
        
        if [ "$days_exp" -gt "$exp_limit" ] ; then
            echo "The certificate is up to date, no need for renewal ($days_exp days left)."
        else
            echo "The certificate for $DARRAYS is about to expire soon. Starting webroot renewal script..."
            le_renew
            echo "Renewal process finished for domain $DARRAYS"
        fi

        echo "Checking domains for $DARRAYS..."

        domains=($(openssl x509  -in $cert_file -text -noout | grep -oP '(?<=DNS:)[^,]*'))
        new_domains=($(
            for domain in ${DARRAYS[@]}; do
                [[ " ${domains[@]} " =~ " ${domain} " ]] || echo $domain
            done
        ))

        if [ -z "$new_domains" ] ; then
            echo "The certificate have no changes, no need for renewal"
        else
            echo "The list of domains for $DARRAYS certificate has been changed. Starting webroot renewal script..."
            le_renew
            echo "Renewal process finished for domain $DARRAYS"
        fi


    else
      echo "[INFO] certificate file not found for domain $DARRAYS. Starting webroot initial certificate request script..."
      le_renew
      echo "Certificate request process finished for domain $DARRAYS"
    fi

    if [ "$1" != "once" ]; then
        sleep ${check_freq}d
        le_check
    fi
}

le_check $1

#certbot certonly --standalone -d aksenchyk.com -d www.aksenchyk.com --text --agree-tos --email aksenchyk.v@gmail.com --server https://acme-v01.api.letsencrypt.org/directory --rsa-key-size 4096 --verbose --renew-by-default --standalone-supported-challenges http-01