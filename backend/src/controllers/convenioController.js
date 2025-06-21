const { Convenio } = require('../models');

const convenioController = {
  async create(req, res) {
    try {
      const { nome, tabelaPrecos } = req.body;
      const novoConvenio = await Convenio.create({ nome, tabelaPrecos });
      res.status(201).json({ success: true, convenio: novoConvenio });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao criar convênio', error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const convenios = await Convenio.findAll();
      res.json({ success: true, convenios });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar convênios' });
    }
  },

  async getById(req, res) {
    try {
      const convenio = await Convenio.findByPk(req.params.id);
      if (!convenio) {
        return res.status(404).json({ success: false, message: 'Convênio não encontrado' });
      }
      res.json({ success: true, convenio });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar convênio' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, tabelaPrecos } = req.body;
      const [updated] = await Convenio.update({ nome, tabelaPrecos }, { where: { id } });

      if (updated) {
        const updatedConvenio = await Convenio.findByPk(id);
        return res.json({ success: true, convenio: updatedConvenio });
      }
      return res.status(404).json({ success: false, message: 'Convênio não encontrado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao atualizar convênio' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Convenio.destroy({ where: { id } });

      if (deleted) {
        return res.status(204).send();
      }
      return res.status(404).json({ success: false, message: 'Convênio não encontrado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao excluir convênio' });
    }
  },
};

module.exports = convenioController;