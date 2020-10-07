FROM node:12-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
RUN npm i pm2 -g
COPY . .

CMD [ "npm", "start" ]
