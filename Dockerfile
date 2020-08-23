FROM node:12.18.3-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm i --production
COPY . .
