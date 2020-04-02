cmd /c "ng build --prod --aot"
cmd /c "docker build --tag=website-nginx ."
cmd /c "docker save website-nginx -o website-nginx.tar"