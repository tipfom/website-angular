echo 'pulling from git'
git pull
echo 'building webapp'
ng build --prod --aot
echo 'creating docker container'
docker build --tag=website-nginx .
docker save website-nginx -o website-nginx.tar
chown tim website-nginx.tar