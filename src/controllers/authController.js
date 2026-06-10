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

      // Verifica se todos os campos foram preenchidos
      if (!nome || !email || !senha) {
        return res.status(400).json({
          error: 'DADOS_OBRIGATORIOS',
          message: 'Nome, email e senha são obrigatórios'
        })
      }

      // Expressão regular para validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'EMAIL_INVALIDO',
          message: 'Informe um email válido'
        })
      }

      // Procura se já existe um usuário com esse email
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

      // Cria o hash da senha antes de salvar no banco
      const senhaHash = await bcrypt.hash(senha, 10)

      // Por padrão todo usuário entra como CLIENTE
      let role = 'CLIENTE'

      // Email definido para criar um administrador
      if (email.toLowerCase() === 'admin@email.com') {
        role = 'ADMIN'
      }

      // Cria o usuário e já cria também o registro de fidelidade
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

      // Busca usuário pelo email informado
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

      // Compara a senha digitada com a senha salva no banco
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

      // Gera o token JWT para autenticação
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