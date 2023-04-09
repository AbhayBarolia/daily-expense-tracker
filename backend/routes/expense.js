const express = require('express');

const routes = express();

const expense = require('../controller/expense');

routes.get('/getuser',expense.getUser);
routes.get('/getexpense',expense.getAllExpense);
routes.post('/addexpense',expense.addExpense);
routes.delete('/delete/:id',expense.deleteExpense);


module.exports = routes;