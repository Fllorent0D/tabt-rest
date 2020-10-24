# TabT-Rest 
![Coverage:branches](./badges/badge-branches.svg)
![Coverage:functions](./badges/badge-functions.svg)
![Coverage:lines](./badges/badge-lines.svg)
![Coverage:statements](./badges/badge-statements.svg)

This api is a bridge to the TabT SOAP API. It contacts TabT and cache results in order to reduce latency for some requests. More documentation will come.

## Prerequisites

- Node 10 or higher (https://nodejs.org/)

## Installation

```bash
$ git clone https://github.com/Fllorent0D/tabt-nest
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
### Start with pm2

```sh
pm2 start ./dist/index.js
```

## Release History

* 1.0.0
    * First complete implementation with OpenApi specs

## Meta

Cardoen Florent – [@Fllorent0D](https://twitter.com/fllorent0D) – f.cardoen@me.com

## Contributing

1. Fork it (<https://github.com/Fllorent0D/Tabt-GraphQL>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
