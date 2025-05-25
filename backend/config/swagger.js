const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POS System API',
      version: '1.0.0',
      description: 'API documentation for Inventory and Billing POS System'
    },
  },
  apis: ['./routes/*.js'], // Scan all route files for documentation
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
