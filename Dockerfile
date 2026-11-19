#base

FROM node:22-slim AS base
WORKDIR /usr/local/app

#front

FROM base AS frontend-base
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend/ ./

FROM frontend-base AS frontend-dev
CMD ["npm", "run", "dev"]

FROM frontend-base AS frontend-build
RUN npm run build

#back

FROM base AS backend-base
COPY backend/package*.json ./
RUN npm ci
COPY ./backend/ .
USER node
EXPOSE 3000

FROM backend-base AS backend-dev
CMD ["npm", "run", "dev"]

#prod

FROM base AS prod
ENV NODE_ENV=production
COPY --from=backend-base /usr/local/app/package*.json ./
RUN npm ci --production && \
    npm cache clean --force
COPY backend/ ./
COPY --from=frontend-build /usr/local/app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "index.js"]
