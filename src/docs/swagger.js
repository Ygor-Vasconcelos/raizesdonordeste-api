const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'API Raízes do Nordeste',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de pedidos, produtos, estoque, unidades e fidelização de clientes.'
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local'
      }
    ],

    tags: [
      {
        name: 'Auth',
        description: 'Autenticação e gerenciamento de usuários'
      },
      {
        name: 'Produtos',
        description: 'Gerenciamento de produtos'
      },
      {
        name: 'Unidades',
        description: 'Gerenciamento de unidades'
      },
      {
        name: 'Estoque',
        description: 'Controle de estoque'
      },
      {
        name: 'Pedidos',
        description: 'Gerenciamento de pedidos'
      },
      {
        name: 'Fidelidade',
        description: 'Programa de fidelização de clientes'
      }
    ],

    components: {

      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {

        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            role: {
              type: 'string'
            }
          }
        },

        Produto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string'
            },
            preco: {
              type: 'number'
            },
            ativo: {
              type: 'boolean'
            }
          }
        },

        Unidade: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string'
            },
            cidade: {
              type: 'string'
            }
          }
        },

        Pedido: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            canalPedido: {
              type: 'string'
            },
            status: {
              type: 'string'
            },
            total: {
              type: 'number'
            }
          }
        },

        Fidelidade: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            pontos: {
              type: 'integer'
            },
            usuarioId: {
              type: 'integer'
            }
          }
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