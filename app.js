const fs= require('fs');

const express = require('express');

const bodyParser= require('body-parser');

const cors= require('cors');

const helmet = require('helmet');

const morgan = require('morgan');

const compression = require('compression');

const sequelize= require('./backend/util/database');

const userRoutes= require('./backend/routes/user');
const expenseRoutes= require('./backend/routes/expense');
const premiumRoutes= require('./backend/routes/premium');

require('dotenv').config();

const app= express();
app.use(helmet());
app.use(compression());
const logStream= fs.createWriteStream('./logReport.log',{flags: 'a'});
app.use(morgan('combined',{stream: logStream}));
app.use(cors());
app.use(bodyParser.json({ extended:false }));

const User = require('./backend/models/user');
const Expense = require('./backend/models/expense');
const Orders = require('./backend/models/orders');
const totalExpense= require('./backend/models/totalExpense');
const fileRecords= require('./backend/models/fileRecord');
const passwordChangeRequest = require('./backend/models/passwordChangeRequest');


app.use('/user',userRoutes);

app.use('/expense',expenseRoutes);

app.use('/premium',premiumRoutes);

Expense.belongsTo(User, {constraints:true, onDelete: 'cascade'});
User.hasMany(Expense);

Orders.belongsTo(User, {constraints:true, onDelete: 'cascade'});
User.hasMany(Orders);

User.hasOne(totalExpense);
totalExpense.belongsTo(User);

User.hasMany(passwordChangeRequest);
passwordChangeRequest.belongsTo(User);

User.hasMany(fileRecords);
fileRecords.belongsTo(User);

sequelize.sync()
.then((results)=>{
    app.listen(process.env.PORT || 3000);
})
.catch((err)=>{console.log(err);});
