const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AnexoExame = sequelize.define('AnexoExame', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nomeArquivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caminhoArquivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = AnexoExame;