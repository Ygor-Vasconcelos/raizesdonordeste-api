const prisma = require('../prisma/prismaClient')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class AuthController {

  async register(req, res) {

  try {

    const {
      nome,
      email,
      senha
    } = req.body

    // Validação de campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: 'DADOS_OBRIGATORIOS',
        message: 'Nome, email e senha são obrigatórios'
      })
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'EMAIL_INVALIDO',
        message: 'Informe um email válido'
      })
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        email
      }
    })

    if (usuarioExiste) {
      return res.status(409).json({
        error: 'USUARIO_EXISTE',
        message: 'Usuário já cadastrado'
      })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    let role = 'CLIENTE'

    if (email.toLowerCase() === 'admin@email.com') {
      role = 'ADMIN'
    }

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role,

        fidelidade: {
          create: {
            pontos: 0
          }
        }
      },
      include: {
        fidelidade: true
      }
    })

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    })

  } catch (error) {

    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: error.message
    })

  }

}

  async login(req, res) {

    try {

      const { email, senha } = req.body

      const usuario = await prisma.usuario.findUnique({
        where: {
          email
        }
      })

      if (!usuario) {
        return res.status(401).json({
          error: 'DADOS_INVALIDOS',
          message: 'Credenciais inválidas'
        })
      }

      const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
      )

      if (!senhaValida) {
        return res.status(401).json({
          error: 'DADOS_INVALIDOS',
          message: 'Credenciais inválidas'
        })
      }

      const accessToken = jwt.sign(
        {
          id: usuario.id,
          role: usuario.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d'
        }
      )

      return res.status(200).json({
        accessToken,
        tokenType: 'Bearer',
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      })

    } catch (error) {

      return res.status(500).json({
        error: 'ERRO_INTERNO',
        message: error.message
      })

    }

  }

}

module.exports = new AuthController()