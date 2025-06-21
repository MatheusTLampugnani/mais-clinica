const express = require('express');
const router = express.Router();
const prontuarioController = require('../controllers/prontuarioController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/consulta/:consultaId', authMiddleware(['medico']), prontuarioController.createOrUpdate);
router.get('/consulta/:consultaId', authMiddleware(['medico', 'paciente']), prontuarioController.getByConsultaId);

module.exports = router;