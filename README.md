# GraphQL-MySQL
API Edictus with GraphQL
A simple GraphQL-MySQL Node.js project to get you started quickly

This template integrates the following:

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [GraphQL](http://graphql.org/)
- [GraphQL-tools](http://dev.apollodata.com/tools/graphql-tools/generate-schema.html)
- [MySQL](https://www.mysql.com/)

Added
- GraphQL ISO Date

Instructions:

npm init -y
npm i express express-graphql graphql graphql-tools graphql-iso-date mysql dotenv

1) Browse to http://localhost:3000/graphql to try out your queries - enjoy!

# Docker
in the current project create a file for build an image
create Dockerfile, visit hub.docker.com for versions of node

Dockerfile (Explained)

FROM node:12  (Required NODE )

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

CMD ["npm", "start"]

........................

Then 

# Building the Image for docker
- first, make sure docker is running

docker build -t edictus

- this build will generates an id for this image 

- to check my images

docker images

- to run as an image of docker (container) as interactive mode
( -p to run in port 4000 otherwise so will use 3000)

docker run -it -p 4000:3000 edictus

- to run as a process

docker run -d -p 4000:3000 edictus

- to view running docker process

docker ps

- to stop the process
(this command requires the process id, you can use the first three characters of the process to stop it)
process name sample 123jfkdjfkldjfk

docker stop 123

- this will stop the process with the name 123jfkdjfkldjfk


