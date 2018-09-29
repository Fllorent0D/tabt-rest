const cluster = require('cluster');
const os = require('os');
const logger = require('./lib/config/winston');
const RedisServer = require('redis-server');
const args = require('minimist')(process.argv.slice(2));
const _ = require('lodash');

const CPUS = os.cpus();
if (cluster.isMaster) {

    if(_.get(args, 'cache', true) === true){
        const redisServer = new RedisServer(6379);
        redisServer.open((err) => {
            if (err === null) {
                logger.info('Redis server started');
            } else {
                logger.error('Redis server error ' + err);
            }
        });
    }

    CPUS.forEach(function () {
        cluster.fork()
    });
    cluster.on('listening', function (worker) {
        logger.info(`Cluster ${worker.process.pid} connected`);
    });
    cluster.on('disconnect', function (worker) {
        logger.info(`Cluster ${worker.process.pid} disconnected`);
    });
    cluster.on('exit', function (worker) {
        console.info(`Cluster ${worker.process.pid} is dead. I will restart it.`);
        cluster.fork();
    });
} else {
    require('./index');
}
