FROM node:latest AS development

WORKDIR /app

COPY package.json /app/packe.json
COPY package-lock.json /app/package-lock.json

COPY . .

RUN yarn install --production

RUN yarn add customize-cra react-app-rewired --dev

CMD ["yarn", "start"]
