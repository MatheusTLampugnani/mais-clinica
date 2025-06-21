const { Medico, Especialidade, Usuario, sequelize } = require('../models');

const medicoController = {
  async create(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { nome, crm, especialidadeIds, login, senha } = req.body;

      const novoUsuario = await Usuario.create({
        nome,
        login,
        senha,
        perfil: 'medico'
      }, { transaction });

      const novoMedico = await Medico.create({
        nome,
        crm,
        UsuarioId: novoUsuario.id
      }, { transaction });

      if (especialidadeIds && especialidadeIds.length > 0) {
        await novoMedico.setEspecialidades(especialidadeIds, { transaction });
      }

      await transaction.commit();

      const medicoCompleto = await Medico.findByPk(novoMedico.id, { include: [Usuario, Especialidade] });
      res.status(201).json({ success: true, medico: medicoCompleto });
      
    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao criar médico:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao criar médico', error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const medicos = await Medico.findAll({ include: [Usuario, Especialidade] });
      res.json({ success: true, medicos });
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar médicos' });
    }
  },
  
  async getById(req, res) {
    try {
      const medico = await Medico.findByPk(req.params.id, { include: [Usuario, Especialidade] });
      if (!medico) {
        return res.status(404).json({ success: false, message: 'Médico não encontrado' });
      }
      res.json({ success: true, medico });
    } catch (error) {
      console.error('Erro ao buscar médico:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar médico' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, crm, especialidadeIds } = req.body;

      const medico = await Medico.findByPk(id);
      if (!medico) {
        return res.status(404).json({ success: false, message: 'Médico não encontrado' });
      }

      await medico.update({ nome, crm });

      if (especialidadeIds) {
        await medico.setEspecialidades(especialidadeIds);
      }
      
      const medicoAtualizado = await Medico.findByPk(id, { include: [Usuario, Especialidade] });
      return res.json({ success: true, medico: medicoAtualizado });
      
    } catch (error) {
      console.error('Erro ao atualizar médico:', error);
      return res.status(500).json({ success: false, message: 'Erro no servidor ao atualizar médico' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Medico.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        return res.status(204).send();
      }
      return res.status(404).json({ success: false, message: 'Médico não encontrado' });
    } catch (error) {
      console.error('Erro ao excluir médico:', error);
      return res.status(500).json({ success: false, message: 'Erro no servidor ao excluir médico' });
    }
  }
};

module.exports = medicoController;