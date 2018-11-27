FROM node:10

ENV NODE_ENV production
WORKDIR /app/server
COPY ./server/package*.json /app/server/
RUN npm install --only=production
COPY ./server/index.js  /app/server/
COPY ./server/server/   /app/server/server/
COPY ./www/templates/   /app/www/templates/
COPY ./www/locales/     /app/www/locales/
COPY ./www/build/       /app/www/build/
CMD ["node", "./index.js"]
