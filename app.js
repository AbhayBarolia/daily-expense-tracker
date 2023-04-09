const express = require('express');

const bodyParser= require('body-parser');

const cors= require('cors');

const sequelize= require('./backend/util/database');

const userRoutes= require('./backend/routes/user');
const expenseRoutes= require('./backend/routes/expense');

const app= express();
app.use(cors());
app.use(bodyParser.json({ extended:false }));

const User = require('./backend/models/user');
const Expense = require('./backend/models/expense');


app.use('/user',userRoutes);

app.use('/expense',expenseRoutes);

Expense.belongsTo(User, {constraints:true, onDelete: 'cascade'});
User.hasMany(Expense);

sequelize.sync()
.then((results)=>{
    app.listen(3000);
})
.catch((err)=>{console.log(err);});
