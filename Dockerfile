FROM node:12-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:12-alpine AS dev
WORKDIR /app
COPY --from=builder /app/ /app/

FROM node:12-alpine AS build
WORKDIR /app
COPY --from=builder /app/ ./app/
COPY . ./
RUN npm i -g pm2-runtime

CMD [ "npm", "start" ]
