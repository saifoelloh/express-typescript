## Installation Instruction

- copy `.env.example` into `.env`, also don't forget to setup with your env
- install all dependencies with your fav package manager `yarn` or `npm`
- execute `yarn generate:key` or `npm run generate:key`
- execute `yarn prisma:migrate` or `npm run prisma:migrate` to migrate schema into your DB
- run your API with `yarn dev` or `npm run dev`

## Docker Way

- please create 1 `postgres` container and 1 custom `network`
- copy `.env.example` into `.env`, also don't forget to setup with your env
- execute `docker-compose --env-file ./.env up -d`
