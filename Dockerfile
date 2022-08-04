FROM node:16-alpine as base

RUN apk update && apk add --upgrade apk-tools && apk upgrade --available
RUN apk --no-cache add curl

FROM base as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm i --local=global @nestjs/cli yarn

COPY . .
RUN yarn
RUN yarn build

FROM builder as deps

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN rm -rf node_modules
RUN yarn

FROM base as runner

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=deps /usr/src/app/node_modules ./node_modules

ENV LISTEN_PORT=3000
ENV LISTEN_PORT_METRICS=8081
EXPOSE $LISTEN_PORT
EXPOSE $LISTEN_PORT_METRICS

ENV NODE_ENV=production

CMD [ "node", "dist/main" ]
