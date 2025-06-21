const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Convenio = sequelize.define('Convenio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tabelaPrecos: {
    type: DataTypes.TEXT,
    comment: 'Pode ser usado para armazenar informações de preços, talvez em formato JSON.'
  }
});

module.exports = Convenio;