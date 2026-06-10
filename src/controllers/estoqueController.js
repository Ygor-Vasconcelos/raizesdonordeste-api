const prisma = require('../prisma/prismaClient')

class EstoqueController {

 async create(req, res) {

  try {

    const {
      unidadeId,
      produtoId,
      quantidade
    } = req.body

    const estoqueExistente = await prisma.estoque.findFirst({
      where: {
        unidadeId,
        produtoId
      }
    })

    let estoque

    if (estoqueExistente) {

      estoque = await prisma.estoque.update({
        where: {
          id: estoqueExistente.id
        },
        data: {
          quantidade: {
            increment: quantidade
          }
        }
      })

    } else {

      estoque = await prisma.estoque.create({
        data: {
          unidadeId,
          produtoId,
          quantidade
        }
      })

    }

    return res.status(201).json(estoque)

  } catch (error) {

    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: error.message
    })

  }

}

  async findAll(req, res) {

    try {

      const estoque = await prisma.estoque.findMany({
        include: {
          produto: true,
          unidade: true
        }
      })

      return res.json(estoque)

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

}

module.exports = new EstoqueController()