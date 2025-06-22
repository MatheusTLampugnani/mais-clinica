const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const prontuarioRoutes = require('./routes/prontuarioRoutes');
const especialidadeRoutes = require('./routes/especialidadeRoutes');
const convenioRoutes = require('./routes/convenioRoutes');
const anexoRoutes = require('./routes/anexoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/prontuarios', prontuarioRoutes);
app.use('/api/especialidades', especialidadeRoutes);
app.use('/api/convenios', convenioRoutes);
app.use('/api/anexos', anexoRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/uploads', express.static('uploads'));


app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }

  res.status(500).json({ success: false, message: 'Algo deu errado no servidor!' });
});

module.exports = app;