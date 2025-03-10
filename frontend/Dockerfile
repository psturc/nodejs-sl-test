FROM registry.access.redhat.com/ubi8/nodejs-20:latest as builder
WORKDIR /opt/app-root/src
COPY frontend .
RUN npm install
RUN npm run build

FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest

LABEL konflux.additional-tags="latest"

WORKDIR /opt/app-root/src
COPY --from=builder /opt/app-root/src/build ./build
RUN npm install sirv-cli -g

EXPOSE 3000
CMD ["sirv", "build", "--cors", "--single", "--host", "--port", "3000"]