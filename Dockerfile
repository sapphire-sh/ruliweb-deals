FROM node:11

RUN mkdir /opt/src
WORKDIR /opt/src

VOLUME [ "/opt/src/data" ]

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

CMD [ "npm", "start" ]
