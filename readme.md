Badge
============

# Demo

## Run server

```
docker-compose up
```

## API

### Get status as json
```
http://localhost:8080/github/microsoft/TypeScript/master/json
```

### Get status as string (`good`, `normal` or `bad`)
```
http://localhost:8080/github/microsoft/TypeScript/master/status
```


### Get status as budge

```
http://localhost:8080/github/microsoft/TypeScript/master/badge
```