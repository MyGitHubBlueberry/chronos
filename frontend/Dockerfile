FROM node:22-slim AS base
WORKDIR /usr/local/app
COPY package*.json ./
RUN npm ci
COPY . ./

FROM base AS dev
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
EXPOSE 80
