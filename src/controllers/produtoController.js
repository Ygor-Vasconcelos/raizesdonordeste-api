const prisma = require('../prisma/prismaClient')

class ProdutoController {

  async create(req, res) {

  try {

    const { nome, preco } = req.body

    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        error: 'NOME_OBRIGATORIO',
        message: 'Nome do produto é obrigatório'
      })
    }

    if (!preco || preco <= 0) {
      return res.status(400).json({
        error: 'PRECO_INVALIDO',
        message: 'Preço deve ser maior que zero'
      })
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        preco
      }
    })

    return res.status(201).json(produto)

  } catch (error) {

    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: error.message
    })

  }

}

  async findAll(req, res) {

    try {

      const produtos = await prisma.produto.findMany()

      return res.json(produtos)

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

}

module.exports = new ProdutoController()