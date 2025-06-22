const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const cadastroRules = () => {
  return [
    body('nome').notEmpty().withMessage('O nome é obrigatório.'),
    body('login').isLength({ min: 4 }).withMessage('O login deve ter no mínimo 4 caracteres.'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
    body('perfil').isIn(['admin', 'medico', 'recepcionista']).withMessage('O perfil é inválido.')
  ];
};

module.exports = {
  cadastroRules,
  validateRequest,
};