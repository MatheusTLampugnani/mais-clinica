const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/consultas', authMiddleware(['admin']), relatorioController.getConsultasPorPeriodo);

module.exports = router;