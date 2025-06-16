const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota pública ou para perfis específicos
router.get('/', authMiddleware(['recepcionista', 'admin']), medicoController.getAll);

// Rotas para admin
router.post('/', authMiddleware(['admin']), medicoController.create);

module.exports = router;