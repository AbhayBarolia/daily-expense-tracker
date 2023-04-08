const express = require('express');

const bodyParser= require('body-parser');

const cors= require('cors');

const sequelize= require('./backend/util/database');

const userRoutes= require('./backend/routes/user');

const app= express();
app.use(cors());
app.use(bodyParser.json({ extended:false }));


app.use('/',userRoutes);




sequelize.sync()
.then((results)=>{
    app.listen(3000);
})
.catch((err)=>{console.log(err);});
