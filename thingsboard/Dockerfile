FROM node:latest AS development

WORKDIR /app

COPY package.json /app/packe.json
COPY package-lock.json /app/package-lock.json

COPY . .

RUN yarn install --production

ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/App.js"]
