const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
require('dotenv').config();

const authController = {
  async login(req, res) {
    try {
      const { login, senha } = req.body;
      
      // Validação dos campos de entrada
      if (!login || !senha) {
        return res.status(400).json({ 
          success: false,
          message: 'Login e senha são obrigatórios' 
        });
      }

      const usuario = await Usuario.findOne({ where: { login } });
      if (!usuario) {
        return res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
      }
      
      const senhaValida = await usuario.validarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
      }
      
      // Criação do token JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          perfil: usuario.perfil 
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      
      // Resposta de sucesso
      res.json({ 
        success: true,
        token,
        perfil: usuario.perfil, 
        nome: usuario.nome,
        id: usuario.id
      });
      
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro no servidor durante o login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async cadastrar(req, res) {
    try {
      const { nome, login, senha, perfil } = req.body;
      
      // Validação dos campos obrigatórios
      if (!nome || !login || !senha || !perfil) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }
      
      // Verifica se o perfil é válido
      const perfisValidos = ['admin', 'medico', 'recepcionista'];
      if (!perfisValidos.includes(perfil)) {
        return res.status(400).json({
          success: false,
          message: 'Perfil inválido'
        });
      }
      
      // Verifica se o usuário já existe
      const usuarioExistente = await Usuario.findOne({ where: { login } });
      if (usuarioExistente) {
        return res.status(400).json({ 
          success: false,
          message: 'Usuário já existe' 
        });
      }
      
      // Cria o novo usuário
      const novoUsuario = await Usuario.create({ 
        nome, 
        login, 
        senha, 
        perfil 
      });
      
      // Resposta de sucesso
      res.status(201).json({ 
        success: true,
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        login: novoUsuario.login,
        perfil: novoUsuario.perfil
      });
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro ao cadastrar usuário',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = authController;