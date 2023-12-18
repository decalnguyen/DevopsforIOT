FROM node:latest as node

WORKDIR /app

COPY . /app

RUN npm install 

RUN npm add customize-cra react-app-rewired --dev

RUN npm install react-bootstrap

RUN npm run build 

FROM nginx:1.12

COPY --from=node /app/build/ /var/www/dist/

COPY --from=node /app/nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]