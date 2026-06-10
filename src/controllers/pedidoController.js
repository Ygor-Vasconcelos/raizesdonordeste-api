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

      // Verifica se o canal do pedido foi informado
      if (!canalPedido) {
        return res.status(400).json({
          error: 'CANAL_OBRIGATORIO',
          message: 'Canal do pedido é obrigatório'
        })
      }

      // Verifica se o método de pagamento foi informado
      if (!metodoPagamento) {
        return res.status(400).json({
          error: 'METODO_PAGAMENTO_OBRIGATORIO',
          message: 'Método de pagamento é obrigatório'
        })
      }

      // Verifica se existe pelo menos um item no pedido
      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
          error: 'ITENS_OBRIGATORIOS',
          message: 'Pedido deve possuir ao menos um item'
        })
      }

      // Verifica se todas as quantidades são válidas
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

      // Busca os dados de fidelidade do usuário
      const fidelidade = await prisma.fidelidade.findUnique({
        where: {
          usuarioId
        }
      })

      // Verifica se existe estoque suficiente para todos os itens
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

      // Calcula o valor total e baixa os itens do estoque
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

      // Aplica desconto caso o usuário tenha benefício disponível
      if (fidelidade?.descontoAtivo) {

        descontoAplicado = total * 0.30

        total = total - descontoAplicado

        // Após utilizar o desconto, os pontos são zerados
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

      // Cria o pedido e seus itens
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

      // Adiciona pontos ao programa de fidelidade
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

        // Libera desconto quando atingir 30 pontos
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

      // Simulação simples de aprovação de pagamento
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

      // Define o status do pedido baseado no pagamento
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

      // Registra ação no log de auditoria
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

      // Lista de status permitidos
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

      // Atualiza o status do pedido
      const pedidoAtualizado = await prisma.pedido.update({
        where: {
          id: Number(id)
        },
        data: {
          status
        }
      })

      // Salva alteração no log
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

      // Busca todos os pedidos ou filtra por canal
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