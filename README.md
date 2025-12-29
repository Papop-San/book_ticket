
# Booking & Seats System (NestJS)

A production-ready backend for managing events, seats, bookings, and notifications built with NestJS and TypeScript.




## Create Env File

```bash
#Server
PORT=8080
CORS_ORIGIN=http://localhost:3000

#PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=02749
DB_NAME=seats
```

## Install dependencies

```bash
npm install
```

## Command Seed Running

```bash
  npx ts-node .\src\database\seed\seed-events.ts
  npx ts-node .\src\database\seed\seed-notification.ts
  npx ts-node .\src\database\seed\seed-seats.ts
```

## Command Running 

```bash
npm run start:dev
```

## Command Testing

```bash
npm run test:watch
```

## URL 

```bash
api url: http://localhost:8080/api
doc url: http://localhost:8080/api-docs
```




