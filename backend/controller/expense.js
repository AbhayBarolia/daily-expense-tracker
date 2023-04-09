const express = require('express');

const Expense = require('../models/expense');

exports.getAllExpense= async (req, res, next) =>{
    try{
        const expense = await Expense.findAll();
        res.status(200).json(expense);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.addExpense= async (req, res, next) =>{
    try{
        const expenseName = req.body.expenseName;
        const amount = req.body.amount;
        const category =req.body.category;
        const created= await Expense.create({ 
            expenseName: expenseName,
            amount: amount,
            category: category,    
            userId:1
        });
        if(created){
            return res.status(201).json({ message: 'User created' });
        }
        else{
            return res.status(201).json({ message: 'User not created' });
        } 
       
    }catch(err){
        res.status(500).json({message: err.message});
    }
}


exports.deleteExpense= async (req, res, next)=>{
 try{
    const expenseId = req.params.id;
    const deleted = await Expense.destroy({
        where:{
            id: expenseId
        }
    });
    if(deleted){
        return res.status(200).json({ message: 'Expense deleted' });
    }
    else{
        return res.status(201).json({ message: 'Expense not deleted' });
    }
 }
 catch(err){
     res.status(500).json({message: err.message});
 }   
}