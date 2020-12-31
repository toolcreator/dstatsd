FROM node:lts-alpine
COPY . .
RUN npm install && npm run build && npm link && npm prune --production
ENTRYPOINT ["dstatsd"]
