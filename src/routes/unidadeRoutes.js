const router = require('express').Router()

const unidadeController = require('../controllers/unidadeController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

/**
 * @swagger
 * /unidades:
 *   get:
 *     summary: Listar unidades
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de unidades
 */
router.get(
  '/',
  authMiddleware,
  unidadeController.findAll
)

/**
 * @swagger
 * /unidades:
 *   post:
 *     summary: Criar unidade
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cidade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Unidade criada com sucesso
 *       400:
 *         description: Inválido
*       401:
 *         description: Token não informado
 *       403:
 *         description: Não autorizado
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  unidadeController.create
)

module.exports = router