const jwt = require('jsonwebtoken')

// Middleware responsável por validar autenticação JWT
function authMiddleware(req, res, next) {

  try {

    // Recupera o header Authorization da requisição
    const authHeader = req.headers.authorization

    // Verifica se o token foi enviado
    if (!authHeader) {
      return res.status(401).json({
        error: 'TOKEN_NAO_INFORMADO',
        message: 'Token não informado'
      })
    }

    // Extrai apenas o token do formato: Bearer TOKEN
    const token = authHeader.split(' ')[1]

    // Verifica se o token é válido
    if (!token) {
      return res.status(401).json({
        error: 'TOKEN_INVALIDO',
        message: 'Token inválido'
      })
    }

    // Decodifica e valida o JWT utilizando a chave secreta
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Armazena os dados do usuário autenticado na requisição
    req.user = decoded

    // Libera acesso para a próxima função
    next()

  } catch (error) {

    // Retorna erro caso o token seja inválido ou expirado
    return res.status(401).json({
      error: 'TOKEN_INVALIDO',
      message: error.message
    })

  }

}

module.exports = authMiddleware