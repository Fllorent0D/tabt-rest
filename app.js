const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const responseTime = require('response-time');
const monitor = require('express-status-monitor');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc')

const PORT = process.env.PORT || 5000;

const winston = require('./src/config/winston');
const apiRouter = require('./src/api-router');

const app = express();
app.use(monitor({title: 'BePing API Status', path:'/api/status'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('common', {stream: winston.stream }));

app.use(compression());
app.use(responseTime());


const swaggerDefinition = {
  info: {
	title: 'TabT Rest', // Title (required)
	version: '1.0.0', // Version (required)
	description: 'A sample API', // Description (optional)
  },
  host: `localhost:${PORT}`, // Host (optional)
  basePath: '/', // Base path (optional)
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./src/api-router.js', './swagger-defs/*.yaml'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {explorer: true}));
app.use('/api', apiRouter);

app.listen(PORT);
winston.info('App liston on port ' + PORT)
