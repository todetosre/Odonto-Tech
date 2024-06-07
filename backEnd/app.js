const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routers/user');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);

// Testar a conexão com o banco de dados
db.sequelize.authenticate()
  .then(() => {
    console.log('Sucesso na conexão com o banco!');
  })
  .catch(err => {
    console.error('Houve o seguinte erro ao se conectar:', err);
  });

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server está rodando na porta: 3000');
  });
});
