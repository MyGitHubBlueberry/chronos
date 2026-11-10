FROM node:22-slim
WORKDIR /chronos/backend
COPY package*.json ./
RUN npm ci
COPY . .
USER node
EXPOSE 3000
CMD ["npm", "start"]