const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('DB_OdontoTech', 'postgres', 'lopersoda9', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
