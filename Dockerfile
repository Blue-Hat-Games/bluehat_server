FROM node:16.14.2

WORKDIR /app
COPY package*.json ./

RUN npm install -g pm2
RUN npm install

COPY . ./
EXPOSE 3000
CMD ["npm", "run", "start"]