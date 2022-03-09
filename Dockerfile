# Common build stage
FROM node:lts as common-build-stage

COPY . ./app

WORKDIR /app

RUN yarn install

RUN yarn init

RUN yarn prisma generate

EXPOSE 3000

# # Development build stage
# FROM common-build-stage as development-build-stage

# ENV NODE_ENV development

# CMD ["npm", "run", "dev"]

# # Production build stage
# FROM common-build-stage as production-build-stage

# ENV NODE_ENV production

# CMD ["npm", "run", "start"]
