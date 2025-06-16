const express = require('express');
const router = express.Router();
const prontuarioController = require('../controllers/prontuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Cria ou atualiza um prontuário (médico)
router.post('/consulta/:consultaId', authMiddleware(['medico']), prontuarioController.createOrUpdate);

// Busca um prontuário (médico ou paciente)
router.get('/consulta/:consultaId', authMiddleware(['medico', 'paciente']), prontuarioController.getByConsultaId);

module.exports = router;