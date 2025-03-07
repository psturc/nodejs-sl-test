FROM registry.access.redhat.com/ubi8/nodejs-20:latest

LABEL konflux.additional-tags="latest"

WORKDIR /opt/app-root/src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]