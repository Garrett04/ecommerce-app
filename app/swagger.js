const swaggerJSDoc = require('swagger-jsdoc');
const swagger = require('express').Router();
const swaggerUi = require('swagger-ui-express');

// swagger definition
const swaggerDefinition = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'E-Commerce API',
          version: '1.0.0',
          description: 'A functioning e-commerce api built using Express, Node.js and Postgres',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: 'Dev Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerJWT: {
                    type: 'apiKey',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                cookieJWT: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'access_token'
                }
            }
        },
        tags: [
            'users',
            'products',
            'orders'
        ]
    }
};
  
// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: [
        './routes/*.js',
        './routes/user/*.js',
        './routes/cart/*.js'
    ],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// serve swagger
swagger.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// swaggerUi setup
swagger.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = swagger;