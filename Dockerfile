FROM node:20.11.0-alpine3.19 AS dev

WORKDIR /app

COPY package.json ./

RUN npm i

CMD ["npm", "run", "start:dev"]



FROM node:20.11.0-alpine3.19 AS prod

WORKDIR /app

COPY package.json ./

ENV SERVER_PORT=8080 DATABASE_HOST=localhost DATABASE_PORT=5433 DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=God092216 DATABASE_NAME=credit_wallet JWT_SECRET=A@lT0Vu3lAN0T3D3t3Ng@S5789513*+
ENV JWT_EXPIRE_IN=2h

RUN npm i

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]

EXPOSE 8080