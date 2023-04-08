const Sequelize = require('sequelize');

const sequelize = new Sequelize('dailyet','root','Abhay@123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;