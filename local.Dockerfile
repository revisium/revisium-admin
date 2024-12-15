FROM --platform=linux/amd64 node:20.11.1-alpine as builder

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN apk update && apk add git

RUN npm run build

FROM  --platform=linux/amd64 nginx:1.25.3-alpine

COPY --from=builder /home/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template


