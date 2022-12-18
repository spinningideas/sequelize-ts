# Sequelize Typescript ORM POC

The code in this repo demonstrates use of [sequelize](https://sequelize.org/v6/) as an ORM using two tables with geography data sets (continents and countries).

This code uses the following libaries:

- [sequelize](https://sequelize.org/v6/)
- [typescript](https://www.typescriptlang.org/)
- [sequelize-typescript](https://github.com/sequelize/sequelize-typescript)
- [express](https://expressjs.com/)
- [postgresql](https://www.postgresql.org/)
- [umzug](https://github.com/sequelize/umzug) - database migrations

This code assumes usage of sequelize@6 and sequelize-typescript requires sequelize and typescript.

This proof of concept uses a repository to get data from database and uses [express](https://expressjs.com/).

## Get Started

To get started perform the following steps:

### 1) Install PostGreSQL for your Operating System (OS)

https://www.postgresql.org/download/

### 2) Create PostGreSQL database to use in this POC

After installing locally you should have a database server - you will need to do these steps:
#### 2.1 Create an empty database named "sequelize_ts_orm_poc"

#### 2.2 enable access to the credentials from Database.ts (username: postgres)

### 3) Install npm packages

Install the required packages via standard command:

```npm install```

### 4) Create database schema using sequelize migrations

See ```runMigrations.ts```

This will happen when you run ```npm run start```

### 5) Populate database with data using sequelize data seeding

See ```runSeeders.ts```

This will happen when you run ```npm run start```

### 6) run the application

The application is configured to use nodemon to monitor for file changes and you can run command to start the application using it. You will see console information with url and port.

```npm run start```

### 7) exercise the application via postman OR thunder client

#### 7.1 - Get a client

1) https://www.thunderclient.com/

2) https://www.getpostman.com - Download and install https://www.getpostman.com 

#### 7.2 - Import "postman" collection and run requests

Use the client of your choice to run the requests to see api data and responses after importing the collection in the "postman" folder


### 8 Inspiration and Read More

- https://github.com/RobinBuschmann/sequelize-typescript-example
- https://blog.logrocket.com/using-sequelize-with-typescript/