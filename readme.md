Badge[![deps-dev-server](https://localhost:8888/github/YaroslavGaponov/badge/main/badge)](https://localhost:8888/github/YaroslavGaponov/badge/main/html)
============

# Demo

## Run server

```
docker-compose up
```

## API

### Prepare

Set to enabled `chrome://flags/#allow-insecure-localhost`

### Get status as json
```
https://localhost:8888/github/microsoft/TypeScript/master/json
```

### Get status as string (`good`, `normal` or `bad`)
```
https://localhost:8888/github/microsoft/TypeScript/master/status
```


### Get status as budge

```
https://localhost:8888/github/microsoft/TypeScript/master/badge
```

### Get status as html

```
https://localhost:8888/github/microsoft/TypeScript/master/html
```