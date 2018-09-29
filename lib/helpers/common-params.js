const _ = require('lodash');
const supportedDatabase = ['vttl', 'aftt'];

createSoapArg = (req, params, needCredentials = true) => {
    const args = {};

    params.forEach((param) => {
        if(_.has(req.params, param)){
            _.set(args, param.charAt(0).toUpperCase() + param.slice(1), _.get(req.params, param));
        } else if(_.has(req.query, param)){
            _.set(args, param.charAt(0).toUpperCase() + param.slice(1), _.get(req.query, param));
        } else if(_.has(req.body, param)) {
            _.set(args, param.charAt(0).toUpperCase() + param.slice(1), _.get(req.body, param));
        }
    });

    if(needCredentials && !!_.get(req.headers, 'x-frenoy-login') && !!_.get(req.headers, 'x-frenoy-password')){
        _.set(args, 'Credentials.Account', _.get(req.headers, 'x-frenoy-login'));
        _.set(args, 'Credentials.Password', _.get(req.headers, 'x-frenoy-password'));
        _.set(args, 'Credentials.OnBehalfOf', _.get(req.headers, 'x-frenoy-f'));
    }

    return args;
};

getDatabaseHeader = (req) => {
    if(!!_.get(req.headers, 'x-frenoy-database') && _.includes(supportedDatabase, _.toLower(_.get(req.headers, 'x-frenoy-database')))){
        return _.toLower(_.get(req.headers, 'x-frenoy-database'));
    }
    return 'vttl';
};

module.exports = {
    getOperationArg : createSoapArg,
    getDatabase     : getDatabaseHeader

};
