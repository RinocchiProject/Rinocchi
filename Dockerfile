FROM node:latest

RUN mkdir runtime

COPY . runtime/

WORKDIR runtime/

RUN npm i -S && npm run build

ENV PORT=8080

CMD ["npm", "run", "start"]
