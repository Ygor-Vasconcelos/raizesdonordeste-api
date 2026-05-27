const prisma = require('../prisma/prismaClient')

class PedidoController {

  async create(req, res) {

    try {

      const {
        unidadeId,
        itens,
        canalPedido,
        metodoPagamento
      } = req.body

      // Valida se o canal do pedido foi informado
      if (!canalPedido) {
        return res.status(400).json({
          error: 'CANAL_OBRIGATORIO',
          message: 'Canal do pedido é obrigatório'
        })
      }

      // Valida se o método de pagamento foi informado
      if (!metodoPagamento) {
        return res.status(400).json({
          error: 'METODO_PAGAMENTO_OBRIGATORIO',
          message: 'Método de pagamento é obrigatório'
        })
      }

      // Valida se o pedido possui itens
      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
          error: 'ITENS_OBRIGATORIOS',
          message: 'Pedido deve possuir ao menos um item'
        })
      }

      // Validação da quantidade dos itens
      for (const item of itens) {

        if (!item.quantidade || item.quantidade <= 0) {

          return res.status(400).json({
            error: 'QUANTIDADE_INVALIDA',
            message: 'Quantidade deve ser maior que zero'
          })

        }

      }

      // Recupera o usuário autenticado através do JWT
      const usuarioId = req.user.id

      let total = 0

      // Valida estoque disponível para todos os itens
      for (const item of itens) {

        const estoque = await prisma.estoque.findFirst({
          where: {
            unidadeId,
            produtoId: item.produtoId
          }
        })

        // Verifica se o produto existe no estoque
        if (!estoque) {
          return res.status(404).json({
            error: 'ESTOQUE_NAO_ENCONTRADO',
            message: 'Produto sem estoque'
          })
        }

        // Verifica quantidade disponível
        if (estoque.quantidade < item.quantidade) {
          return res.status(409).json({
            error: 'ESTOQUE_INSUFICIENTE',
            message: 'Não há quantidade suficiente para um ou mais itens.',
            details: [
              {
                field: 'itens.quantidade',
                issue: `Disponível: ${estoque.quantidade}`
              }
            ]
          })
        }

      }

      // Calcula valor total do pedido e decrementa estoque
      for (const item of itens) {

        const produto = await prisma.produto.findUnique({
          where: {
            id: item.produtoId
          }
        })

        // Verifica se o produto existe
        if (!produto) {
          return res.status(404).json({
            error: 'PRODUTO_NAO_ENCONTRADO',
            message: `Produto ${item.produtoId} não encontrado`
          })
        }

        // Soma valor total do pedido
        total += produto.preco * item.quantidade

        // Atualiza estoque após confirmação do item
        await prisma.estoque.updateMany({
          where: {
            unidadeId,
            produtoId: item.produtoId
          },
          data: {
            quantidade: {
              decrement: item.quantidade
            }
          }
        })

      }

      // Criação do pedido e seus itens
    const pedido = await prisma.pedido.create({
  data: {
    usuarioId,
    unidadeId,
    canalPedido,
    total,
    itens: {
      create: await Promise.all(
        itens.map(async item => {

          const produto = await prisma.produto.findUnique({
            where: {
              id: item.produtoId
            }
          })

          return {
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnit: produto.preco
          }

        })
      )
    }
  },
  include: {
    itens: true
  }
})

await prisma.fidelidade.update({
  where: {
    usuarioId
  },

  data: {
    pontos: {
      increment: 10
    }
  }
})
      // Simulação de integração com gateway de pagamento
      const pagamentoAprovado = Math.random() > 0.3

      const pagamento = await prisma.pagamento.create({
        data: {
          pedidoId: pedido.id,
          metodo: metodoPagamento,
          status: pagamentoAprovado
            ? 'APROVADO'
            : 'RECUSADO'
        }
      })

      // Define status do pedido conforme resultado do pagamento
      const novoStatus = pagamentoAprovado
        ? 'PAGO'
        : 'CANCELADO'

      // Atualiza status do pedido
      await prisma.pedido.update({
        where: {
          id: pedido.id
        },
        data: {
          status: novoStatus
        }
      })

      // Registra evento no log de auditoria
      await prisma.logAuditoria.create({
        data: {
          acao: `Pedido ${novoStatus}`,
          entidade: 'Pedido'
        }
      })

      return res.status(201).json({
        pedidoId: pedido.id,
        status: novoStatus,
        pagamento,
        total
      })

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

  async updateStatus(req, res) {

    try {

      const { id } = req.params
      const { status } = req.body

      // Lista de status permitidos
      const statusValidos = [
        'AGUARDANDO_PAGAMENTO',
        'PAGO',
        'EM_PREPARO',
        'PRONTO',
        'ENTREGUE',
        'CANCELADO'
      ]

      // Valida se o status informado é válido
      if (!statusValidos.includes(status)) {
        return res.status(400).json({
          error: 'STATUS_INVALIDO',
          message: 'Status do pedido inválido'
        })
      }

      // Verifica se o pedido existe
      const pedidoExiste = await prisma.pedido.findUnique({
        where: {
          id: Number(id)
        }
      })

      if (!pedidoExiste) {
        return res.status(404).json({
          error: 'PEDIDO_NAO_ENCONTRADO',
          message: 'Pedido não encontrado'
        })
      }

      // Atualiza status do pedido
      const pedidoAtualizado = await prisma.pedido.update({
        where: {
          id: Number(id)
        },
        data: {
          status
        }
      })

      // Registra alteração no log de auditoria
      await prisma.logAuditoria.create({
        data: {
          acao: `Pedido atualizado para ${status}`,
          entidade: 'Pedido'
        }
      })

      return res.json(pedidoAtualizado)

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

  async findAll(req, res) {

    try {

      const { canalPedido } = req.query

      // Permite filtrar pedidos por canal
      const pedidos = await prisma.pedido.findMany({
        where: canalPedido
          ? {
              canalPedido
            }
          : {},
        include: {
          itens: true,
          pagamento: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          },
          unidade: true
        }
      })

      return res.json(pedidos)

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

}

module.exports = new PedidoController()