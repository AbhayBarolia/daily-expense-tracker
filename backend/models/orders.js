const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const Orders = sequelize.define('orders',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  orderId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  paymentId:{
    type:Sequelize.STRING,
    allowNull:false
  },
  status:{
    type: Sequelize.STRING,
    allowNull:false
  }
});

module.exports= Orders;