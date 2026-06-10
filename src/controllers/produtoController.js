const prisma = require('../prisma/prismaClient')

class ProdutoController {

  async create(req, res) {

    try {

      const { nome, preco } = req.body

      // Verifica se o nome foi informado
      if (!nome || nome.trim() === '') {
        return res.status(400).json({
          error: 'NOME_OBRIGATORIO',
          message: 'Nome do produto é obrigatório'
        })
      }

      // Verifica se o preço é válido
      if (!preco || preco <= 0) {
        return res.status(400).json({
          error: 'PRECO_INVALIDO',
          message: 'Preço deve ser maior que zero'
        })
      }

      // Cadastra o produto no banco
      const produto = await prisma.produto.create({
        data: {
          nome,
          preco
        }
      })

      // Retorna o produto criado
      return res.status(201).json(produto)

    } catch (error) {

      // Tratamento de erro interno
      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

  async findAll(req, res) {

    try {

      // Busca todos os produtos cadastrados
      const produtos = await prisma.produto.findMany()

      return res.json(produtos)

    } catch (error) {

      // Erro ao consultar produtos
      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

}

module.exports = new ProdutoController()