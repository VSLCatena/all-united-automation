FROM node:21-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV SYSTEMNAME=my-system-name
ENV USERNAME=my-username
ENV PASSWORD=my-password

CMD [ "npm", "start" ]