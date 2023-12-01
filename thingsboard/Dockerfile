FROM node:latest AS development

WORKDIR /app

COPY package.json /app/packe.json
COPY package-lock.json /app/package-lock.json
COPY . /app

RUN yarn install --production

ENV CI=true

ENV PORT=8089

CMD ["node", "src/index.js"]

EXPOSE 8089