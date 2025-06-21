const express = require('express');
const router = express.Router();
const anexoController = require('../controllers/anexoController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post('/upload', authMiddleware(['medico']), upload.single('exame'), anexoController.upload);

module.exports = router;