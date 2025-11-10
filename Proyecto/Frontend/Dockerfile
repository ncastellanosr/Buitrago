# syntax=docker/dockerfile:1
FROM node:24-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install serve -g
RUN npm install typeorm
RUN npm install reflect-metadata
RUN npm install @types/node --save-dev
RUN npm install mysql
RUN npm i -g serve
COPY .  .
#COPY tsconfig*.json .
#RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "dist"]

