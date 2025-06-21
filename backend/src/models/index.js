const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Paciente = require('./Paciente');
const Medico = require('./Medico');
const Especialidade = require('./Especialidade');
const Consulta = require('./Consulta');
const Prontuario = require('./Prontuario');
const Convenio = require('./Convenio');
const AnexoExame = require('./AnexoExame');

Medico.belongsTo(Usuario, { onDelete: 'CASCADE' });
Paciente.belongsTo(Usuario, { onDelete: 'CASCADE' });

Medico.belongsToMany(Especialidade, { through: 'MedicoEspecialidades' });
Especialidade.belongsToMany(Medico, { through: 'MedicoEspecialidades' });

Consulta.belongsTo(Paciente);
Consulta.belongsTo(Medico);
Consulta.belongsTo(Convenio);
Paciente.hasMany(Consulta);
Medico.hasMany(Consulta);
Convenio.hasMany(Consulta);

Prontuario.belongsTo(Consulta, { onDelete: 'CASCADE' });
Consulta.hasOne(Prontuario);

AnexoExame.belongsTo(Prontuario, { onDelete: 'CASCADE' });
Prontuario.hasMany(AnexoExame);

const db = {
  sequelize,
  Usuario,
  Paciente,
  Medico,
  Especialidade,
  Consulta,
  Prontuario,
  Convenio,    
  AnexoExame,  
};

module.exports = db;