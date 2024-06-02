FROM node:20.11.0-alpine3.19 AS prod

WORKDIR /app

COPY package.json ./

RUN npm i yarn

RUN yarn

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]

EXPOSE 8080