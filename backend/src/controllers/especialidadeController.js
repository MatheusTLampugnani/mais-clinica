const { Especialidade } = require('../models');

const especialidadeController = {
  async create(req, res) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ success: false, message: 'O nome da especialidade é obrigatório.' });
      }

      const novaEspecialidade = await Especialidade.create({ nome });
      res.status(201).json({ success: true, especialidade: novaEspecialidade });

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ success: false, message: 'Essa especialidade já existe.' });
      }
      console.error('Erro ao criar especialidade:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao criar especialidade.' });
    }
  },

  async getAll(req, res) {
    try {
      const especialidades = await Especialidade.findAll({
        order: [['nome', 'ASC']]
      });
      res.json({ success: true, especialidades });
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar especialidades.' });
    }
  }
};

module.exports = especialidadeController;