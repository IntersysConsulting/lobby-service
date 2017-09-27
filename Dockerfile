FROM node:8

ENV APP_PATH /usr/src/
WORKDIR ${APP_PATH}

ADD package.json ${APP_PATH}/package.json
RUN npm install
ADD . ${APP_PATH}

EXPOSE 8080
CMD ["npm", "start"]