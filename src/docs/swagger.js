const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'API Raízes do Nordeste',
      version: '1.0.0',
      description: 'Documentação da API'
    },

    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },

  apis: ['./src/routes/*.js']
}

const specs = swaggerJsdoc(options)

module.exports = {
  swaggerUi,
  specs
}