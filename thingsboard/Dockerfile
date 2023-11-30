FROM node:latest AS development

WORKDIR /app

COPY package.json ./app/packe.json
COPY package-lock.json ./app/package-lock.json

RUN npm ci

COPY . /app

ENV CI=true

ENV PORT=8089

CMD ["npm", "start"]

FROM development AS build

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/.nginx/conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/build .

CMD ["nginx", "-g", "daemon off;"]