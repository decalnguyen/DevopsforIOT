FROM node:13.12.0-alpine as node

WORKDIR /app

COPY package*.json /app

RUN npm install 

COPY . /app

RUN npm run build 

FROM nginx:1.12

COPY --from=node /app/build/ /var/www/dist/

COPY --from=node /app/nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]