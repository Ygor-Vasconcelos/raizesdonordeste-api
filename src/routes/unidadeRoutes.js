const router = require('express').Router()

const unidadeController = require('../controllers/unidadeController')
const authMiddleware = require('../middlewares/authMiddleware')

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
 */
router.post(
  '/',
  authMiddleware,
  unidadeController.create
)

module.exports = router