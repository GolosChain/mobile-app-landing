#!/usr/bin/env sh

cd "$(dirname "$0")"

cd www && \
npm install && \
npm run build && \
cd .. && \
sudo docker-compose up -d --build
