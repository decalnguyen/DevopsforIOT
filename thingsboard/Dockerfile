FROM node:latest AS build

WORKDIR /app

COPY package.json /app/packe.json
COPY package-lock.json /app/package-lock.json

COPY . .

RUN npm install --production

RUN npm add customize-cra react-app-rewired --dev

CMD ["npm", "start"]

EXPOSE 3000