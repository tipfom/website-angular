cmd /c "ng build --prod"
cmd /c "docker build --tag=website-nginx ."
cmd /c "docker save website-nginx -o website-nginx.tar"