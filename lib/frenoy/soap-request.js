const soap = require('soap');
// const xml = require('fs').readFileSync(require('path').resolve(__dirname, 'vttl.xml'), 'UTF-8');
const port = process.env.PORT || 5000;

const soapClient = (db) => soap.createClientAsync('http://localhost:' + port + '/wsdl/' + db + '.wsdl.xml');
const request = (func, args, db, ip) => soapClient(db).then((client) => {
    client.addHttpHeader('x-forwarded-for', ip);
    return client[func + 'Async'](args)
}).then(result => Promise.resolve(result[0]));

module.exports = request;
