const express = require('express');

const routes = express();

const expense = require('../controller/expense');

routes.get('/getuser',expense.getUser);

routes.get('/getexpense/:page/:offset',expense.getAllExpense);

routes.get('/getpremiumlist',expense.premiumTotalExpense);

routes.get('/report',expense.generateReport);

routes.get('/reportrecords',expense.reportRecords);

routes.post('/addexpense',expense.addExpense);

routes.delete('/delete/:id',expense.deleteExpense);


module.exports = routes;