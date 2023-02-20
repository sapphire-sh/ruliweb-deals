FROM node:18-alpine as builder

RUN mkdir -p /opt/project
WORKDIR /opt/project

RUN node --version
RUN npm --version

COPY package* ./

RUN npm install

COPY src/ ./src
COPY webpack.config.js tsconfig.json ./

RUN npm run build

FROM node:18-alpine

COPY --from=builder /opt/project/package.json /opt/project/package-lock.json /app/
COPY --from=builder /opt/project/dist /app/dist

WORKDIR /app/

RUN npm install --release

CMD [ "npm", "start" ]
