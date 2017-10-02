# lobby-service
A NodeJS microservice to host the information send from the LobbyApp.


## Run it with Docker
1. Build it with `docker build -t lobby-service .`
2. Run it with `docker run -it --rm --name lby-serv -v ${PWD}/index.js:/usr/src/index.js -v ${PWD}/src:/usr/src/src -v ${PWD}/images:/usr/src/images -p 3000:3000 lobby-service`