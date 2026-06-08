FROM debian:trixie

RUN apt update && apt upgrade -y && apt install tsc
EXPOSE 443
