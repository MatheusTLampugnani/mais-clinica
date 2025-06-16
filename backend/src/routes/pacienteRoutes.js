const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas protegidas para recepcionistas e médicos
router.get('/', authMiddleware(['recepcionista', 'medico']), pacienteController.getAll);
router.get('/:id', authMiddleware(['recepcionista', 'medico']), pacienteController.getById);

// Rota para admin (exemplo)
router.post('/', authMiddleware(['admin']), pacienteController.create);
router.put('/:id', authMiddleware(['admin']), pacienteController.update);
router.delete('/:id', authMiddleware(['admin']), pacienteController.delete);

module.exports = router;