FROM node:12-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
RUN npm install pm2 -g

COPY . ./

CMD [ "pm2-runtime", "./bin/www" ]
