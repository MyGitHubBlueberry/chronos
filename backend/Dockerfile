FROM node:22-slim AS base
WORKDIR /usr/local/app
COPY package*.json ./

FROM base AS dev
RUN npm ci
COPY . .
USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS prod
ENV NODE_ENV=production
RUN npm ci --production && \
    npm cache clean --force
COPY . ./
USER node
EXPOSE 3000
CMD ["node", "index.js"]
