const express = require('express')

const estoqueController = require('../controllers/estoqueController')

const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

const router = express.Router()

/**
 * @swagger
 * /estoque:
 *   get:
 *     summary: Lista estoque
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista estoque
 */
router.get(
  '/',
  authMiddleware,
  estoqueController.findAll
)

/**
 * @swagger
 * /estoque:
 *   post:
 *     summary: Cria estoque
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unidadeId:
 *                 type: integer
 *               produtoId:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Estoque criado
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  estoqueController.create
)

module.exports = router