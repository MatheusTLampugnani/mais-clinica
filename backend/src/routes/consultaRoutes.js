const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const authMiddleware = require('../middleware/authMiddleware');

const adminOnly = authMiddleware(['admin']);
const medicoOnly = authMiddleware(['medico']);
const pacienteOnly = authMiddleware(['paciente']);
const recepcionistaOnly = authMiddleware(['recepcionista']);
const recepcionistaOrAdmin = authMiddleware(['recepcionista', 'admin']);

router.post('/', recepcionistaOnly, consultaController.create);
router.get('/', adminOnly, consultaController.getAll);
router.get('/fila-espera', recepcionistaOrAdmin, consultaController.getFilaDeEspera);
router.get('/medico/:id', medicoOnly, consultaController.getByMedico);
router.get('/paciente/:id', pacienteOnly, consultaController.getByPaciente);
router.delete('/:id', authMiddleware(['paciente', 'recepcionista']), consultaController.delete);


module.exports = router;