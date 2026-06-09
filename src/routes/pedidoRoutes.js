const router = require('express').Router()

const pedidoController = require('../controllers/pedidoController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: canalPedido
 *         schema:
 *           type: string
 *           enum:
 *             - APP
 *             - TOTEM
 *             - BALCAO
 *             - PICKUP
 *             - WEB
 *         description: Filtrar pedidos por canal
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get(
  '/',
  authMiddleware,
  pedidoController.findAll
)

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidadeId
 *               - canalPedido
 *               - metodoPagamento
 *               - itens
 *             properties:
 *               unidadeId:
 *                 type: integer
 *                 example: 1
 *               canalPedido:
 *                 type: string
 *                 enum:
 *                   - APP
 *                   - TOTEM
 *                   - BALCAO
 *                   - PICKUP
 *                   - WEB
 *                 example: APP
 *               metodoPagamento:
 *                 type: string
 *                 enum:
 *                   - PIX
 *                   - CARTAO
 *                   - DINHEIRO
 *                 example: PIX
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       404:
 *        description: Produto sem estoque
 */
router.post(
  '/',
  authMiddleware,
  pedidoController.create
)

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - AGUARDANDO_PAGAMENTO
 *                   - PAGO
 *                   - EM_PREPARO
 *                   - PRONTO
 *                   - ENTREGUE
 *                   - CANCELADO
 *                 example: EM_PREPARO
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       403:
 *         description: Sem permissão
 */
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  pedidoController.updateStatus
)

module.exports = router