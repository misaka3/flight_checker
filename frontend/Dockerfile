FROM node:lts-slim

WORKDIR /front

RUN apt-get update && \
    apt-get install -y curl && \
    npm install yarn && \
    npm install -g next

ENV CI=true

COPY app/package.json ./
COPY app/yarn.lock ./
RUN yarn install

COPY app/update-tinySdf.sh .
RUN chmod +x ./update-tinySdf.sh

RUN ./update-tinySdf.sh

CMD ["yarn", "dev"]
