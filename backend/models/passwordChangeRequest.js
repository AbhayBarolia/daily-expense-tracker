const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const passwordChangeRequest = sequelize.define('passwordchangerequest',{
  uuid:{
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  isActive:{
    type: Sequelize.BOOLEAN,
    allowNull:false
  }
 
});

module.exports= passwordChangeRequest;