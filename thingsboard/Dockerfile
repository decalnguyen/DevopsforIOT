FROM node:13.12.0-alpine as node

WORKDIR /app

#RUN npm install 

#COPY . /app

#RUN npm add customize-cra react-app-rewired

#RUN npm install react-bootstrap

#RUN npm run build 
COPY build /app

FROM nginx:1.12

COPY --from=node /app/build/ /var/www/dist/

COPY --from=node /app/nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]