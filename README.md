# DrivenPass Project
- Back-end project to save sensitive informations, like cards, credentials and notes.
- You can test accessing the deploy: https://dashboard.render.com/web/srv-cjr1che1208c738f4lr0
- You can access more information with Swagger. You just need to access /api in your application.

## About
Features implemented for this API:
- Sign-up: Register your account;
- Sign-in: Login with your account;
- Cards: You can add, get all or a specific card by user and delete a card by user;
- Credentials: You can add, get all or a specific credential by user and delete a credential by user;
- Notes: You can add, get all or a specific note by user and delete a note by user;
- Erase: Delete all cards, credentials, notes and user information from the database;

Using this API, you can save sensitive information so in case you forget it, with protection.

## Technologies
To build this project, the following technologies where used:

- Libraries: bcrypt, cryptr, dotenv-cli;

![JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)&nbsp;
![TS](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)&nbsp;
![Nest](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)&nbsp;
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)&nbsp;
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)&nbsp;
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)&nbsp;
![Swagget](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)&nbsp;

## How to use

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
