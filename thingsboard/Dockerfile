FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install 

RUN npm add customize-cra react-app-rewired --dev

COPY . . 

RUN npm run build 

FROM nginx:1.12

COPY --from=build /app/build/ /usr/share/nginx/html

COPY --from=build nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]