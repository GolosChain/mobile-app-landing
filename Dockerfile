FROM node:10
WORKDIR /app-www
COPY www/package*.json /app-www/
RUN npm install
COPY www/gulpfile.js /app-www/
COPY www/src /app-www/src
ENV NODE_ENV production
RUN npm run build

FROM node:10
WORKDIR /app/server
COPY server/package*.json /app/server/
RUN npm install --only=production
ENV NODE_ENV production
COPY server/index.js           /app/server/
COPY server/server/            /app/server/server/
COPY www/src/templates         /app/www/src/templates/
COPY www/src/locales           /app/www/src/locales/
COPY --from=0 /app-www/build/  /app/www/build/
CMD ["node", "./index.js"]
