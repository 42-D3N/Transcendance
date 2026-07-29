FROM node:26-trixie
RUN useradd -ms /bin/sh -u 1001 app
USER app

WORKDIR /app
COPY --chown=app:app ./srcs/package.json ./srcs/package-lock.json ./
RUN npm install
COPY --chown=app:app ./srcs /app
EXPOSE 5173