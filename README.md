To run the server locally
Install postgredb

copy sample.env to .env

Install dependency
`npm install`

Db migration
`npx prisma generate`
`npx prisma migrate dev --name init`

`npx prisma db seed`
`npm run watch`

## Running with docker

install docker on your machine

clone the app and install dependency with `npm install`

Run `docker compose up -d` in the project directory

`docker exec -it backend sh`

in the root directory /usr

Initialize the prisma environment

`npx prisma migrate dev --name init`

`npx prisma db seed`

server should be acessible on localhost:40001
