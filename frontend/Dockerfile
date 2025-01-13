FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS builder
WORKDIR /opt/app-root/src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN rm -rf ./node_modules

FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest
WORKDIR /opt/app-root/src
COPY --from=builder /opt/app-root/src .
RUN npm install sirv-cli -g

EXPOSE 3000
CMD ["sirv", "build", "--cors", "--single", "--host", "--port", "3000"]