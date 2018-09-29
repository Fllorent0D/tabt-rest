const _ = require('lodash');
const {getDatabase, getOperationArg} = require('./common-params');
const {getResponseFromCache, setInCache} = require('../helpers/cache');
const logger = require('../config/winston');
const request = require('../frenoy/soap-request');
const argv = require('minimist')(process.argv.slice(2));

let badRequest = (res, reason) => {
    logger.error({message: 'Request not accepted', reason: reason});
    res.status(400)
        .json({message: 'Request not accepted', reason: reason})
        .end();
};

let noAccess = (res, reason) => {
    res.status(401)
        .json({message: 'No access', reason: reason})
        .end();
};

let serverError = (res, err) => {
    logger.error({message: 'Server error', reason: err.message});

    res.status(500)
        .json({message: 'Server error', reason: err.message})
        .end();
};

let noData = (res) => {
    res.status(204).end();
};

let sendData = (res, response) => {
    res.status(200)
        .json(response)
        .end();
};

const handleError = (res, err) => {
    _.has(err, 'cause.root.Envelope.Body.Fault.faultcode') ?
        badRequest(res, _.get(err, 'cause.root.Envelope.Body.Fault.faultstring')) :
        serverError(res, err);
};

const handleRequestWithCache = (req, res, opts) => {
    const args = getOperationArg(req, opts.args, opts.needCredentials);
    const db = getDatabase(req);

    getResponseFromCache(opts.operation, args, db)
        .then((result) => {
            // If in cache just pass to next step
            logger.info(`${opts.operation}-${JSON.stringify(args)} Found in cache`);
            return Promise.resolve(result);
        }, () => {
            // If not in cache request to frenoy
            logger.debug(`Soap request from ${opts.operation} on ${db}`);
            return request(opts.operation, args, db)
                .then((result) => {
                    if(opts.cacheDuration > 0 && _.get(argv, 'cache', true) === true){
                        setInCache(args, result, opts.cacheDuration, opts.operation, db);
                    }
                    return Promise.resolve(result);
                })
        })
        .then((result) => {
            if (opts.entityCountKey && opts.entitiesKey) {
                if (_.get(result, opts.entityCountKey) === 0) {
                    noData(res, result);
                } else if (!!_.get(args, opts.returnUniqueValue)) {
                    sendData(res, _.get(result, `${opts.entitiesKey}[0]`));
                } else {
                    sendData(res, _.get(result, opts.entitiesKey));
                }
            } else {
                sendData(res, result);
            }
        })
        .catch((err) => handleError(res, err))

};

module.exports = {
    badRequest: badRequest,
    noAccess: noAccess,
    serverError: serverError,
    noData: noData,
    sendData: sendData,
    handleError: handleError,
    handleRequestWithCache: handleRequestWithCache
};
