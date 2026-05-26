 // Middleware responsável pelo controle de acesso por perfil
function roleMiddleware(rolesPermitidas = []) {

  return (req, res, next) => {

    // Recupera o perfil do usuário autenticado
    const userRole = req.user.role

    // Verifica se o perfil possui permissão para acessar a rota
    if (!rolesPermitidas.includes(userRole)) {
      return res.status(403).json({
        error: 'SEM_PERMISSAO',
        message: 'Você não possui permissão'
      })
    }

    // Libera acesso caso o perfil seja permitido
    next()

  }

}

module.exports = roleMiddleware