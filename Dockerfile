FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY ./dist/tienda .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
ENTRYPOINT ["ng","serve"]