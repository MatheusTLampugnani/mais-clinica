const { Paciente, Usuario } = require('../models');

const pacienteController = {
  // Cadastra um novo paciente e o associa a um usuário
  async create(req, res) {
    try {
      const { nome, dataNascimento, cpf, contato, usuarioId } = req.body;

      const novoPaciente = await Paciente.create({
        nome,
        dataNascimento,
        cpf,
        contato,
        UsuarioId: usuarioId
      });

      res.status(201).json({ success: true, paciente: novoPaciente });
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao criar paciente' });
    }
  },

  // Retorna todos os pacientes cadastrados
  async getAll(req, res) {
    try {
      const pacientes = await Paciente.findAll({ include: Usuario });
      res.json({ success: true, pacientes });
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor ao buscar pacientes' });
    }
  },

  // Retorna um paciente específico pelo ID
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