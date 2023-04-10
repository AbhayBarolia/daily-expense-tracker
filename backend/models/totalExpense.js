const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const TotalExpense = sequelize.define('totalexpense',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userName:{
    type: Sequelize.STRING,
    allowNull: false
  },
  totalExpense:{
    type:Sequelize.INTEGER,
    allowNull:false
  }
});

module.exports= TotalExpense;