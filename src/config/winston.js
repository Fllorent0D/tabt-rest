const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, colorize, simple } = format;

// define the custom settings for each transport (file, console)
const options = {
    file: {
        level: 'info',
        filename: `${appRoot.path}/logs/app.log`,
        handleExceptions: true,
        format: combine(
          timestamp(),
          json()
        ),
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: combine(
          colorize(),
          simple()
        ),
    },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function(message) {
        logger.info(message);
    },
};

module.exports = logger;
