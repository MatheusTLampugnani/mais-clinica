const { Prontuario, Consulta } = require('../models');

const prontuarioController = {
  async createOrUpdate(req, res) {
    try {
      const consultaId = req.params.consultaId;
      const { historico, diagnostico, prescricao } = req.body;

      const consulta = await Consulta.findByPk(consultaId);
      if (!consulta) {
        return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
      }

      let prontuario = await Prontuario.findOne({ where: { ConsultaId: consultaId } });

      if (prontuario) {
        await prontuario.update({ historico, diagnostico, prescricao });
      } else {
        prontuario = await Prontuario.create({
          historico,
          diagnostico,
          prescricao,
          ConsultaId: consultaId
        });
        await consulta.update({ status: 'realizada' });
      }

      res.status(200).json({ success: true, prontuario });
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao salvar prontuário' });
    }
  },

  async getByConsultaId(req, res) {
    try {
      const consultaId = req.params.consultaId;
      const prontuario = await Prontuario.findOne({ where: { ConsultaId: consultaId } });

      if (!prontuario) {
        return res.status(404).json({ success: false, message: 'Prontuário não encontrado para esta consulta' });
      }

      res.json({ success: true, prontuario });
    } catch (error) {
      console.error('Erro ao buscar prontuário:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar prontuário' });
    }
  }
};

module.exports = prontuarioController;