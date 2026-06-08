FROM node:26-trixie

RUN mkdir /svelte
WORKDIR /svelte
COPY ./srcs .
RUN npm install
EXPOSE 5173
CMD [ "npm", "run", "dev", "--", "--host"]