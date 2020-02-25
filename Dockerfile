FROM node:alpine

WORKDIR /app/

ENV NG_CLI_ANALYTICS ci
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

EXPOSE 4200

CMD npm install -g @angular/cli ; npm install ; ng serve --host 0.0.0.0 --disable-host-check
