const express = require('express');
const router = express.Router();
const convenioController = require('../controllers/convenioController');
const authMiddleware = require('../middleware/authMiddleware');

const adminOnly = authMiddleware(['admin']);
const adminOrRecepcionista = authMiddleware(['admin', 'recepcionista']);

router.get('/', adminOrRecepcionista, convenioController.getAll);
router.get('/:id', adminOrRecepcionista, convenioController.getById);
router.post('/', adminOnly, convenioController.create);
router.put('/:id', adminOnly, convenioController.update);
router.delete('/:id', adminOnly, convenioController.delete);

module.exports = router;