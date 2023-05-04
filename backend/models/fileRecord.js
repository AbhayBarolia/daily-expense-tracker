const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const FileRecord = sequelize.define('filerecord',{
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
  fileLink:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports= FileRecord;