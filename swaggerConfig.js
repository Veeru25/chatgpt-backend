// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Authentication API',
//       version: '1.0.0',
//       description: 'API documentation for authentication',
//     },
//     servers: [
//       {
//         url: 'http://localhost:9000/api',
//         description: 'Development server',
//       },
//     ],
//   },
//   apis: ['./routes/*.js', './routes/userDetailsRoutes.js'],
// };

// const swaggerSpec = swaggerJsdoc(options);

// module.exports = { swaggerUi, swaggerSpec };

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'API documentation for authentication',
    },
    servers: [
      {
        url: 'http://localhost:9000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './routes/userDetailsRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };

