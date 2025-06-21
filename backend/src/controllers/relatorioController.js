const { Consulta, Medico } = require('../models');
const { Op } = require('sequelize');

const relatorioController = {
  async getConsultasPorPeriodo(req, res) {
    try {
      const { dataInicio, dataFim } = req.query;

      if (!dataInicio || !dataFim) {
        return res.status(400).json({ success: false, message: 'Data de início e fim são obrigatórias.' });
      }

      const relatorio = await Consulta.findAll({
        where: {
          dataHora: {
            [Op.between]: [new Date(dataInicio), new Date(dataFim)],
          },
        },
        attributes: [
          'MedicoId',
          [Medico.sequelize.fn('COUNT', Medico.sequelize.col('Consulta.id')), 'total_consultas'],
        ],
        include: [{
          model: Medico,
          attributes: ['nome'],
        }],
        group: ['MedicoId', 'Medico.id'],
        raw: true,
      });

      res.json({ success: true, relatorio });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao gerar relatório.', error: error.message });
    }
  },
};

module.exports = relatorioController;