# Stage 1 - base
FROM node:22-alpine as base

RUN npm i -g pnpm

# Stage 2 - dependencies
FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json pnpm.lock.yaml ./

RUN pnpm install

# Stage 3 - build
FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN pnpm build
RUN pnpm prune --prod

# Stage 4 - runtime
FROM node:22-alpine AS deploy

WORKDIR /usr/src/app

COPY --from=build /app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3333

CMD ["dist/server.js"]