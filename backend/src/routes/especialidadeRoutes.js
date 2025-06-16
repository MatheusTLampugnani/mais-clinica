const express = require('express');
const router = express.Router();
const especialidadeController = require('../controllers/especialidadeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(['admin', 'recepcionista']), especialidadeController.getAll);
router.post('/', authMiddleware(['admin']), especialidadeController.create);

module.exports = router;