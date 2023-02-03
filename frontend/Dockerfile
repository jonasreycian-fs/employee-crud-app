# Description: Dockerfile for the frontend using multi-stage builds

FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

FROM node:16-alpine as production

COPY --from=build /app /
EXPOSE 9000
CMD ["npm", "start"]
