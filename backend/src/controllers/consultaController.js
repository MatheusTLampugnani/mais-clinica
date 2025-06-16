const { Consulta, Paciente, Medico, Prontuario } = require('../models');

const consultaController = {
  async create(req, res) {
    try {
      const { pacienteId, medicoId, dataHora } = req.body;
      const novaConsulta = await Consulta.create({ 
        PacienteId: pacienteId, 
        MedicoId: medicoId, 
        dataHora 
      });
      res.status(201).json({ success: true, consulta: novaConsulta });
    } catch (error){
      console.error('Erro ao agendar consulta:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao agendar consulta' });
    }
  },

  async getAll(req, res) {
    try {
      const consultas = await Consulta.findAll({
        include: [
          { model: Paciente, attributes: ['nome'] },
          { model: Medico, attributes: ['nome'] }
        ],
        order: [['dataHora', 'ASC']]
      });
      res.json({ success: true, consultas });
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar consultas' });
    }
  },

  async getByMedico(req, res) {
    try {
      const medicoId = req.params.id;
      const consultas = await Consulta.findAll({
        where: { MedicoId: medicoId },
        include: [{ model: Paciente, attributes: ['id', 'nome'] }],
        order: [['dataHora', 'ASC']]
      });
      res.json({ success: true, consultas });
    } catch (error) {
      console.error('Erro ao buscar consultas do médico:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
  },

  async getByPaciente(req, res) {
    try {
      const pacienteId = req.params.id;
      const consultas = await Consulta.findAll({
        where: { PacienteId: pacienteId },
        include: [{ model: Medico, attributes: ['id', 'nome'] }],
        order: [['dataHora', 'DESC']]
      });
      res.json({ success: true, consultas });
    } catch (error) {
      console.error('Erro ao buscar consultas do paciente:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
  },

    async delete(req, res) {
    try {
      const { id } = req.params;
      const consulta = await Consulta.findByPk(id);

      if (!consulta) {
        return res.status(404).json({ message: 'Consulta não encontrada' });
      }

      if (consulta.status !== 'agendada') {
        return res.status(400).json({ message: 'Apenas consultas agendadas podem ser canceladas.' });
      }

      await consulta.destroy();
      return res.status(204).send();

    } catch (error) {
      return res.status(500).json({ message: 'Erro ao cancelar consulta' });
    }
  },
};

module.exports = consultaController;