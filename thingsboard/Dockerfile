FROM node:latest as node

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install 

COPY . /app

RUN npm add customize-cra react-app-rewired --dev

RUN npm install react-bootstrap

RUN npm run build 

FROM nginx:1.12

COPY --from=node /app/build/ /var/www/dist/

COPY --from=node /app/nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]