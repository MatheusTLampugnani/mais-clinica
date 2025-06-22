const { Paciente, Usuario, sequelize } = require('../models');

const pacienteController = {
  async create(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { nome, dataNascimento, cpf, contato, login, senha } = req.body;

      const usuarioExistente = await Usuario.findOne({ where: { login } });
      if (usuarioExistente) {
        await transaction.rollback();
        return res.status(409).json({
          success: false, 
          message: 'O login informado já está em uso. Por favor, escolha outro.' 
        });
      }

      const novoUsuario = await Usuario.create({
        nome,
        login,
        senha,
        perfil: 'paciente'
      }, { transaction });

      const novoPaciente = await Paciente.create({
        nome,
        dataNascimento,
        cpf,
        contato,
        UsuarioId: novoUsuario.id
      }, { transaction });
      
      await transaction.commit();
      res.status(201).json({ success: true, paciente: novoPaciente });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao criar paciente:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao criar paciente', error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const pacientes = await Paciente.findAll({ include: Usuario });
      res.json({ success: true, pacientes });
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar pacientes' });
    }
  },

  async getById(req, res) {
    try {
      const paciente = await Paciente.findByPk(req.params.id, { include: Usuario });
      if (!paciente) {
        return res.status(404).json({ success: false, message: 'Paciente não encontrado' });
      }
      res.json({ success: true, paciente });
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar paciente' });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Paciente.update(req.body, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedPaciente = await Paciente.findByPk(req.params.id);
        return res.json({ success: true, paciente: updatedPaciente });
      }
      return res.status(404).json({ success: false, message: 'Paciente não encontrado' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Paciente.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        return res.status(204).send();
      }
      return res.status(404).json({ success: false, message: 'Paciente não encontrado' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
  }
};

module.exports = pacienteController;