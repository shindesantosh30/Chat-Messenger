const { Sequelize } = require('sequelize');
const config = require('./config.json');

const env = process.env.NODE_ENV || 'development';
const localConfig = config[env];

const sequelize = new Sequelize(localConfig.database, localConfig.username, localConfig.password, {
  host: localConfig.host,
  dialect: localConfig.dialect,
});

module.exports = sequelize;
