const { Router } = require('express')

const FidelidadeController = require('../controllers/FidelidadeController')

const routes = Router()

/**
 * @swagger
 * /fidelidade/{usuarioId}:
 *   get:
 *     tags:
 *       - Fidelidade
 *     summary: Consultar fidelidade do usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fidelidade encontrada
 *       404:
 *         description: Fidelidade não encontrada
 */
routes.get('/:usuarioId', FidelidadeController.show)

module.exports = routes