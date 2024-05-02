FROM node:latest

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

COPY prisma ./prisma
COPY .env ./

# RUN yarn add prisma

RUN npx prisma generate

# RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]


# docker build -t rntsza/bcknd .
# docker run -p 3000:3000 rntsza/bcknd 