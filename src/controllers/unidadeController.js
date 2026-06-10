const prisma = require('../prisma/prismaClient')

class UnidadeController {

  async create(req, res) {

    try {

      const {
        nome,
        cidade
      } = req.body

      // Verifica se o nome da unidade foi informado
      if (!nome || nome.trim() === '') {
        return res.status(400).json({
          error: 'NOME_OBRIGATORIO',
          message: 'Nome da unidade é obrigatório'
        })
      }

      // Verifica se a cidade foi informada
      if (!cidade || cidade.trim() === '') {
        return res.status(400).json({
          error: 'CIDADE_OBRIGATORIA',
          message: 'Cidade é obrigatória'
        })
      }

      // Cria a unidade no banco de dados
      const unidade = await prisma.unidade.create({
        data: {
          nome,
          cidade
        }
      })

      // Retorna a unidade cadastrada
      return res.status(201).json(unidade)

    } catch (error) {

      // Erro interno do servidor
      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

  async findAll(req, res) {

    try {

      // Busca todas as unidades cadastradas
      const unidades = await prisma.unidade.findMany()

      return res.json(unidades)

    } catch (error) {

      // Erro ao buscar unidades
      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

}

module.exports = new UnidadeController()