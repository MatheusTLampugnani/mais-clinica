const { Consulta, Paciente, Medico, Prontuario, AnexoExame } = require('../models');
const { Op } = require('sequelize');


const consultaController = {
  async create(req, res) {
    try {
      let { pacienteId, medicoId, dataHora, convenioId } = req.body;

      if (!pacienteId || !medicoId || !dataHora) {
        return res.status(400).json({
          success: false,
          message: 'A seleção de Paciente, Médico e a Data/Hora são obrigatórios.'
        });
      }
      if (convenioId === '') {
        convenioId = null;
      }
      
      const novaConsulta = await Consulta.create({ 
        PacienteId: pacienteId, 
        MedicoId: medicoId, 
        ConvenioId: convenioId,
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

  async getFilaDeEspera(req, res) {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);

      const fila = await Consulta.findAll({
        where: {
          dataHora: {
            [Op.gte]: hoje,
            [Op.lt]: amanha,
          },
          status: 'agendada',
        },
        include: [
          { model: Paciente, attributes: ['nome'] },
          { model: Medico, attributes: ['nome'] }
        ],
        order: [['dataHora', 'ASC']]
      });
      res.json({ success: true, fila });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar fila de espera', error: error.message });
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
        include: [
          { 
            model: Medico, 
            attributes: ['id', 'nome'] 
          },
          {
            model: Prontuario,
            include: [ AnexoExame ]
          }
        ],
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
      const consulta = await Consulta.findByPk(id, { include: Paciente });

      if (!consulta) {
        return res.status(404).json({ message: 'Consulta não encontrada' });
      }

      const usuarioLogado = req.usuario;
      if (usuarioLogado.perfil === 'paciente' && consulta.Paciente.UsuarioId !== usuarioLogado.id) {
        return res.status(403).json({ message: 'Acesso negado. Você não pode cancelar a consulta de outro paciente.' });
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