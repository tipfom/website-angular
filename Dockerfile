FROM nginx:1.17.1-alpine
COPY /dist/website-angular /usr/share/nginx/html
