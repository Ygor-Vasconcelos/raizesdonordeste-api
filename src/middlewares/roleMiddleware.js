// Middleware para controlar acesso por perfil
function roleMiddleware(rolesPermitidas = []) {

  return (req, res, next) => {

    // Perfil do usuário autenticado
    const userRole = req.user.role

    // Verifica se o usuário tem permissão
    if (!rolesPermitidas.includes(userRole)) {
      return res.status(403).json({
        error: 'SEM_PERMISSAO',
        message: 'Você não possui permissão'
      })
    }

    // Permissão concedida
    next()

  }

}

module.exports = roleMiddleware