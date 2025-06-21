const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(['recepcionista', 'admin']), medicoController.getAll);
router.post('/', authMiddleware(['admin']), medicoController.create);

module.exports = router;