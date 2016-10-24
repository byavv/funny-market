# Build docker images for nginx and letsencript
#!/bin/bash
#
docker build -t aksenchyk/fm-nginx:build ./nginx
docker build -t aksenchyk/fm-letsencrypt:build ./le

docker tag aksenchyk/fm-nginx:build aksenchyk/fm-nginx:latest
docker tag aksenchyk/fm-letsencrypt:build aksenchyk/fm-letsencrypt:latest

###EOF###