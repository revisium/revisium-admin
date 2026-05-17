FROM node:24.11.1-alpine AS builder

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN apk update && apk add git

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.25.3-alpine

ENV REVISIUM_ROBOTS_TXT=

COPY --from=builder /home/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --chmod=755 docker/40-render-robots-txt.sh /docker-entrypoint.d/40-render-robots-txt.sh
