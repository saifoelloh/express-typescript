# Common build stage
FROM node:lts

WORKDIR /app

COPY . .

RUN yarn

RUN sh ./commands.sh

RUN yarn prisma:generate

EXPOSE $APP_PORT
