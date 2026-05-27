require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const produtoRoutes = require('./routes/produtoRoutes')
const unidadeRoutes = require('./routes/unidadeRoutes')
const estoqueRoutes = require('./routes/estoqueRoutes')
const pedidoRoutes = require('./routes/pedidoRoutes')
const fidelidadeRoutes = require('./routes/fidelidadeRoutes')
const { swaggerUi, specs } = require('./docs/swagger')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/auth', authRoutes)
app.use('/produtos', produtoRoutes)
app.use('/unidades', unidadeRoutes)
app.use('/estoque', estoqueRoutes)
app.use('/pedidos', pedidoRoutes)
app.use('/fidelidade', fidelidadeRoutes)

app.get('/', (req, res) => {
  return res.json({
    message: 'API funcionando'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})