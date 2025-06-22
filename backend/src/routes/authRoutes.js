const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { cadastroRules, validateRequest } = require('../validator/authValidator');

router.post('/login', authController.login);
router.post('/cadastrar', cadastroRules(), validateRequest, authController.cadastrar);

module.exports = router;