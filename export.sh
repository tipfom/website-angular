ng build --prod --aot
docker build --tag=website-nginx .
docker save website-nginx -o website-nginx.tar
chown tim website-nginx.tar