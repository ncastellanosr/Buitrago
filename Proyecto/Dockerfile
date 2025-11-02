# syntax=docker/dockerfile:1
FROM node:24-alpine
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install serve -g
RUN npm i -g serve
COPY .  .
RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "dist"]

