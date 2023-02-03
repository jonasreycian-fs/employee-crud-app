# Description: Dockerfile for the frontend using multi-stage builds

# Development stage
FROM node:16-alpine as develop-stage

WORKDIR /app
COPY package*.json ./
RUN npm install --global @quasar/cli
COPY . .

# Build stage
FROM develop-stage as build-stage
RUN npm install
RUN quasar build

# Production stage
FROM nginx:alpine-slim as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
