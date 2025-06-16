const app = require('./app');
const { sequelize } = require('./models');
const db = require('./models');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ force: false });
    console.log('Todos os modelos foram sincronizados com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Acesse a API em http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
    process.exit(1);
  }
};

startServer();