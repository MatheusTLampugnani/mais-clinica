const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const authMiddleware = require('../middleware/authMiddleware');

// Agenda consulta (recepcionista)
router.post('/', authMiddleware(['recepcionista']), consultaController.create);

// Busca todas as consultas (admin)
router.get('/', authMiddleware(['admin']), consultaController.getAll);

// Busca consultas por médico (médico)
router.get('/medico/:id', authMiddleware(['medico']), consultaController.getByMedico);

// Busca consultas por paciente (paciente)
router.get('/paciente/:id', authMiddleware(['paciente']), consultaController.getByPaciente);

// Permite que um paciente ou recepcionista cancele uma consulta
router.delete('/:id', authMiddleware(['paciente', 'recepcionista']), consultaController.delete);

module.exports = router;