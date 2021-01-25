FROM node:lts-alpine
WORKDIR /dstatsd
COPY . .
RUN npm install && npm run build && npm link && npm prune --production
ENTRYPOINT ["dstatsd"]
