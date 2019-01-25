const redis = require('redis');
const stringify = require('json-stable-stringify');
const _ = require('lodash');
const logger = require('../config/winston');
const argv = require('minimist')(process.argv.slice(2));
let client;
if (_.get(argv, 'cache', true) === true) {
  client = redis.createClient();

  client.on('connect', function () {
    logger.info('Redis client connected');
  });

  client.on('error', function (err) {
    logger.error('Redis client error : ' + err);
  });
}

const getResponseFromCache = (operation, args, db) => {

  return new Promise((resolve, reject) => {
    if (_.get(argv, 'cache', true) !== true) {
      reject();
      return;
    }
    _.set(args, '__operation', operation);
    _.set(args, '__database', db);

    client.get(stringify(args), (err, result) => {
      if (result) {
        let obj = JSON.parse(result);
        resolve(obj);
      } else {
        reject();
      }
    });
  });
};

const setInCache = (args, value, time, operation, db) => {
  _.set(args, '__operation', operation);
  _.set(args, '__database', db);

  client.setex(stringify(args), time, stringify(value));
};

const flushCache = async () => {
  return new Promise((resolve, reject) => {
    client.flushdb((err, succeeded) => {
      if(err){
        logger.error(err)
      }
      resolve(succeeded)
    });
  });
}

module.exports = {
  getResponseFromCache: getResponseFromCache,
  setInCache: setInCache,
  flushCache: flushCache
};
