const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prontuario = sequelize.define('Prontuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  historico: {
    type: DataTypes.TEXT
  },
  diagnostico: {
    type: DataTypes.TEXT
  },
  prescricao: {
    type: DataTypes.TEXT
  }
});

module.exports = Prontuario;