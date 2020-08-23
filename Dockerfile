FROM node:12.18.3-alpine as debug

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "debug"]

FROM node:12.18.3-alpine as prod

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
COPY . .

CMD ["npm", "start"]