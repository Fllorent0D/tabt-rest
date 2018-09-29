const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const responseTime = require('response-time');
const monitor = require('express-status-monitor');

const PORT = process.env.PORT || 5000;

const winston = require('./lib/config/winston');
const apiRouter = require('./lib/api-router');

const app = express();
app.use(monitor({title: 'BePing API Status', path:'/api/status'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('common', { stream: winston.stream }));
app.use(compression());
app.use(responseTime());
app.use('/api', apiRouter);

app.listen(PORT);
