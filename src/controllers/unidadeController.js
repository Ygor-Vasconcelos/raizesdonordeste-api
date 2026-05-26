const prisma = require('../prisma/prismaClient')

class UnidadeController {

 async create(req, res) {

  try {

    const {
      nome,
      cidade
    } = req.body

    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        error: 'NOME_OBRIGATORIO',
        message: 'Nome da unidade é obrigatório'
      })
    }

    if (!cidade || cidade.trim() === '') {
      return res.status(400).json({
        error: 'CIDADE_OBRIGATORIA',
        message: 'Cidade é obrigatória'
      })
    }

    const unidade = await prisma.unidade.create({
      data: {
        nome,
        cidade
      }
    })

    return res.status(201).json(unidade)

  } catch (error) {

    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: error.message
    })

  }

}

  async findAll(req, res) {

    try {

      const unidades = await prisma.unidade.findMany()

      return res.json(unidades)

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

}

module.exports = new UnidadeController()