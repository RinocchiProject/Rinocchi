FROM node:latest

RUN mkdir runtime

COPY . runtime/

WORKDIR runtime/

RUN mkdir backups/

RUN npm i -S && npm run build

ENV PORT=8080

CMD ["npm", "run", "start"]
