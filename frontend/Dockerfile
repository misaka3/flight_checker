FROM node:lts-slim

WORKDIR /front

RUN apt-get update && \
    apt-get install -y curl && \
    npm install yarn && \
    npm install -g next

COPY app/package.json ./
COPY app/yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --no-progress

ENV CI=true

COPY . .
