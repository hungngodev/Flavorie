FROM node:alpine3.18
WORKDIR /myapp
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5100
CMD [ "npm", "run", "start" ]