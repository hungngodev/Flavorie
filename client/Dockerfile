FROM node:latest AS builder
WORKDIR /myapp
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM alpine:latest
WORKDIR /frontend
COPY --from=builder /myapp/dist .
