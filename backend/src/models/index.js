const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Paciente = require('./Paciente');
const Medico = require('./Medico');
const Especialidade = require('./Especialidade');
const Consulta = require('./Consulta');
const Prontuario = require('./Prontuario');

Medico.belongsTo(Usuario);
Paciente.belongsTo(Usuario);

Medico.belongsToMany(Especialidade, { through: 'MedicoEspecialidades' });
Especialidade.belongsToMany(Medico, { through: 'MedicoEspecialidades' });

Consulta.belongsTo(Paciente);
Consulta.belongsTo(Medico);
Paciente.hasMany(Consulta);
Medico.hasMany(Consulta);

Prontuario.belongsTo(Consulta);
Consulta.hasOne(Prontuario);

const db = {
  sequelize,
  Usuario,
  Paciente,
  Medico,
  Especialidade,
  Consulta,
  Prontuario
};

module.exports = db;