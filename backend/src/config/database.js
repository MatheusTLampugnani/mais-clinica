const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    define: {
      schema: 'mais_clinica'
    },
    searchPath: 'mais_clinica'
  }
);

module.exports = sequelize;