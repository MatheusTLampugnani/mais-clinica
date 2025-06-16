const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acesso negado. Nenhum token fornecido.' 
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.perfil)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Acesso negado. Você не tem permissão para acessar este recurso.' 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido ou expirado.' 
      });
    }
  };
};

module.exports = authMiddleware;