FROM caddy:2.11.4
RUN apk update
RUN apk add openssl
COPY Caddyfile /etc/caddy/Caddyfile
RUN mkdir -p /app/certs
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -out /app/certs/nginx.crt -keyout /app/certs/nginx.key -subj "/CN=ft_old_internet.local"
EXPOSE 5000