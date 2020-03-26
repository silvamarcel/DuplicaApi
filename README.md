# API Documentation

## API Status
[![Build Status](https://duplica.semaphoreci.com/badges/DuplicaApi.svg)](https://semaphoreci.com/silvamarcel/duplicaapi)
[![CodeFactor](https://www.codefactor.io/repository/github/silvamarcel/duplicaapi/badge)](https://www.codefactor.io/repository/github/silvamarcel/duplicaapi)

## Table of contents

* [Dependencies](#dependencies)
* [Install](#install)
* [Run](#run)
* [Test](#tests)
* [Deploy](#deploy)
* [Structure of the API](#structure-of-the-api)
* [Deploying to prod](#deploying-to-prod)

# Follow the next steps to Install, Run, Test and Deploy the API.

## Dependencies

* NodeJS
* MongoDB
* Docker (Optional)
* Nodemon Globally (npm install -g nodemon)

## Install
```
npm i
```

## Run
```
npm start
```

## Tests
### Runs all tests like in the CI environment
```
npm test
```
### Runs all tests like in the CI environment and keep watching
```
npm run test:auto
```
### Coverage tests
```
npm run coverage
```
### Lint tests
```
npm run lint
```

## Deploy
```
It automatically deploys the code to Staging when it is committed in the Master branch.
```

## Structure of the API
    .
    ├── server                  # Server Source files
        ├── api                 # API Modules/Routers/Features files
        ├── auth                # Authentication files
        ├── config              # Config files
        ├── error               # Error builder, handler and types
        ├── log                 # Loggers
        ├── middleware          # Middlewares of the application
        ├── store               # Stores e.g. Database
        ├── server.js           # Server definition file of the application
    ├── tests                   # Setup, tools and utilities for tests
        ├── utils               # Tools and utilities for tests
        ├── setup.js            # Setup for all integration tests
    ├── index.js                # Main file of the application
    ├── package.json            # NPM configuration file
    ├── LICENSE                 # MIT License file
    └── README.md               # This file

## Deploying to prod

Right now this happens manually in the Heroku pipeline.~~~~~~~~~~~~~~~~

* https://dashboard.heroku.com/pipelines/03450c39-130b-4b97-97dc-8fc68ef3f800
