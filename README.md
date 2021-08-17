# POC - Feature Flag 

## Feature flag service

#### This service will turn on and off some endpoint for 'service' - no restart need.

##### Download Dependencies, install and run
```
sudo docker run -d -p 27017:27017 --name=mydb mongo:4.2
sudo docker run --name my-redis-container -p 7001:6379 -d redis
cd feature-flag
npm i
npm run start:dev
```
##### Save the first flag
```
curl --location --request POST 'http://localhost:3200/features' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id_front": "boton",
    "enable": true,
    "visible": true,
    "host": "localhost:3000",
    "path": "/",
    "method": "GET",
    "status": true
}'
```
###### 'id_front' is for you frontend id/tag identification, like 'enable' and 'visible' values
###### 'status' is for you backend this need block you route if is false. The route will be 'host' + 'path' and the verb (method).
## Service

##### Service Dependency, install and run
```
cd servicio
npm i
```
##### when 'feature flag service' is up execute next command
```
npm run start:dev
```

## Test
```
When 'feature flag service' is up open some navigator and go to 'http://localhost:3200/'
```