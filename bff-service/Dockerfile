FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "./build/index.js"]