FROM node:latest AS builder
ARG  VITE_SOCKET_SERVER
ARG  VITE_PEER_JS_HOST
ARG VITE_PEER_JS_PORT

ENV VITE_SOCKET_SERVER=$VITE_SOCKET_SERVER
ENV VITE_PEER_JS_HOST=$VITE_PEER_JS_HOST
ENV VITE_PEER_JS_PORT=$VITE_PEER_JS_PORT

WORKDIR /myapp
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /myapp/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
