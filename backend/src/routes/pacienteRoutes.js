const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['admin', 'recepcionista']), pacienteController.create);
router.get('/', authMiddleware(['recepcionista', 'medico']), pacienteController.getAll);
router.get('/:id', authMiddleware(['recepcionista', 'medico']), pacienteController.getById);
router.put('/:id', authMiddleware(['admin']), pacienteController.update);
router.delete('/:id', authMiddleware(['admin']), pacienteController.delete);

module.exports = router;