const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

const authController = {
  async login(req, res) {
    try {
      const { login, senha } = req.body;
      
      const usuario = await Usuario.findOne({ where: { login } });
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      const senhaValida = await usuario.validarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      
      res.json({ token, perfil: usuario.perfil, nome: usuario.nome });
    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  async cadastrar(req, res) {
    try {
      const { nome, login, senha, perfil } = req.body;
      
      const usuarioExistente = await Usuario.findOne({ where: { login } });
      if (usuarioExistente) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }
      
      const novoUsuario = await Usuario.create({ nome, login, senha, perfil });
      
      res.status(201).json({ 
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        login: novoUsuario.login,
        perfil: novoUsuario.perfil
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
  }
};

module.exports = authController;