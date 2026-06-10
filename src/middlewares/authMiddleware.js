const jwt = require('jsonwebtoken')

// Middleware para validar o token JWT
function authMiddleware(req, res, next) {

  try {

    // Pega o Authorization enviado na requisição
    const authHeader = req.headers.authorization

    // Verifica se o token foi enviado
    if (!authHeader) {
      return res.status(401).json({
        error: 'TOKEN_NAO_INFORMADO',
        message: 'Token não informado'
      })
    }

    // Separa o token do Bearer
    const token = authHeader.split(' ')[1]

    // Verifica se o token existe
    if (!token) {
      return res.status(401).json({
        error: 'TOKEN_INVALIDO',
        message: 'Token inválido'
      })
    }

    // Valida o token usando a chave JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Salva os dados do usuário autenticado
    req.user = decoded

    // Continua para a próxima rota
    next()

  } catch (error) {

    // Token inválido ou expirado
    return res.status(401).json({
      error: 'TOKEN_INVALIDO',
      message: error.message
    })

  }

}

module.exports = authMiddleware