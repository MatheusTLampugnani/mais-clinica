const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const authMiddleware = require('../middleware/authMiddleware');

const adminOnly = authMiddleware(['admin']);
const adminOrRecepcionista = authMiddleware(['admin', 'recepcionista']);

router.get('/', adminOrRecepcionista, medicoController.getAll);
router.get('/:id', adminOnly, medicoController.getById);
router.post('/', adminOnly, medicoController.create);
router.put('/:id', adminOnly, medicoController.update);
router.delete('/:id', adminOnly, medicoController.delete);

module.exports = router;