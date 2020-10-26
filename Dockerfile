FROM nginx

COPY dist /usr/share/nginx/html
COPY nginxConfig/site.conf /etc/nginx/conf.d/default.conf

EXPOSE 80