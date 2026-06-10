const prisma = require('../prisma/prismaClient')

class FidelidadeController {

  async show(req, res) {

    try {

      const { usuarioId } = req.params

      // Busca os dados de fidelidade do usuário informado
      const fidelidade = await prisma.fidelidade.findUnique({
        where: {
          usuarioId: Number(usuarioId)
        }
      })

      // Verifica se existe registro de fidelidade
      if (!fidelidade) {
        return res.status(404).json({
          error: 'FIDELIDADE_NAO_ENCONTRADA'
        })
      }

      return res.json(fidelidade)

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_AO_BUSCAR_FIDELIDADE'
      })

    }

  }

}

module.exports = new FidelidadeController()