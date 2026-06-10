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

      if (!canalPedido) {
        return res.status(400).json({
          error: 'CANAL_OBRIGATORIO',
          message: 'Canal do pedido é obrigatório'
        })
      }

      if (!metodoPagamento) {
        return res.status(400).json({
          error: 'METODO_PAGAMENTO_OBRIGATORIO',
          message: 'Método de pagamento é obrigatório'
        })
      }

      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
          error: 'ITENS_OBRIGATORIOS',
          message: 'Pedido deve possuir ao menos um item'
        })
      }

      for (const item of itens) {

        if (!item.quantidade || item.quantidade <= 0) {
          return res.status(400).json({
            error: 'QUANTIDADE_INVALIDA',
            message: 'Quantidade deve ser maior que zero'
          })
        }

      }

      const usuarioId = req.user.id

      let total = 0
      let descontoAplicado = 0

      const fidelidade = await prisma.fidelidade.findUnique({
        where: {
          usuarioId
        }
      })

      for (const item of itens) {

        const estoque = await prisma.estoque.findFirst({
          where: {
            unidadeId,
            produtoId: item.produtoId
          }
        })

        if (!estoque) {
          return res.status(404).json({
            error: 'ESTOQUE_NAO_ENCONTRADO',
            message: 'Produto sem estoque'
          })
        }

        if (estoque.quantidade < item.quantidade) {
          return res.status(409).json({
            error: 'ESTOQUE_INSUFICIENTE',
            message: 'Não há quantidade suficiente para um ou mais itens.'
          })
        }

      }

      for (const item of itens) {

        const produto = await prisma.produto.findUnique({
          where: {
            id: item.produtoId
          }
        })

        if (!produto) {
          return res.status(404).json({
            error: 'PRODUTO_NAO_ENCONTRADO',
            message: `Produto ${item.produtoId} não encontrado`
          })
        }

        total += produto.preco * item.quantidade

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

      if (fidelidade?.descontoAtivo) {

        descontoAplicado = total * 0.30

        total = total - descontoAplicado

        await prisma.fidelidade.update({
          where: {
            usuarioId
          },
          data: {
            descontoAtivo: false,
            pontos: 0
          }
        })

      }

      const pedido = await prisma.pedido.create({
        data: {
          usuarioId,
          unidadeId,
          canalPedido,
          total,
          itens: {
            create: await Promise.all(
              itens.map(async (item) => {

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

      if (fidelidade) {

        const fidelidadeAtualizada = await prisma.fidelidade.update({
          where: {
            usuarioId
          },
          data: {
            pontos: {
              increment: 10
            }
          }
        })

        if (
          fidelidadeAtualizada.pontos >= 30 &&
          !fidelidadeAtualizada.descontoAtivo
        ) {

          await prisma.fidelidade.update({
            where: {
              usuarioId
            },
            data: {
              descontoAtivo: true
            }
          })

        }

      }

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

      const novoStatus = pagamentoAprovado
        ? 'PAGO'
        : 'CANCELADO'

      await prisma.pedido.update({
        where: {
          id: pedido.id
        },
        data: {
          status: novoStatus
        }
      })

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
        descontoAplicado,
        total
      })

    } catch (error) {

      console.error(error)

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

      const statusValidos = [
        'AGUARDANDO_PAGAMENTO',
        'PAGO',
        'EM_PREPARO',
        'PRONTO',
        'ENTREGUE',
        'CANCELADO'
      ]

      if (!statusValidos.includes(status)) {
        return res.status(400).json({
          error: 'STATUS_INVALIDO',
          message: 'Status do pedido inválido'
        })
      }

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

      const pedidoAtualizado = await prisma.pedido.update({
        where: {
          id: Number(id)
        },
        data: {
          status
        }
      })

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

      const pedidos = await prisma.pedido.findMany({
        where: canalPedido
          ? { canalPedido }
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