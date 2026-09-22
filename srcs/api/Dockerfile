FROM node:26-trixie AS dev
WORKDIR /app

RUN --mount=type=bind,source=./srcs/package.json,target=package.json \
    --mount=type=bind,source=./srcs/package-lock.json,target=package-lock.json \
    npm ci
COPY ./srcs /app
RUN npm run build

EXPOSE 9090

CMD ["npm", "run", "dev"]

FROM node:26-trixie AS deps
WORKDIR /app

RUN --mount=type=bind,source=srcs/package.json,target=package.json \
    --mount=type=bind,source=srcs/package-lock.json,target=package-lock.json \
    npm ci --omit=dev

FROM node:26-trixie AS runner
WORKDIR /app

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=dev --chown=node:node /app/dist ./dist

EXPOSE 9090

CMD ["node", "dist/index.js"]