const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(['recepcionista', 'medico']), pacienteController.getAll);
router.get('/:id', authMiddleware(['recepcionista', 'medico']), pacienteController.getById);
router.post('/', authMiddleware(['admin']), pacienteController.create);
router.put('/:id', authMiddleware(['admin']), pacienteController.update);
router.delete('/:id', authMiddleware(['admin']), pacienteController.delete);

module.exports = router;