const express = require('express');

const Expense = require('../models/expense');
const User = require('../models/user');
const Orders= require('../models/orders');
const totalExpense= require('../models/totalExpense');

const jwt=require('jsonwebtoken');
const sequelize = require('../util/database');
const secret = "secret_key";

let userId;
let premium;


exports.getUser= async function(req, res, next) {
try{
    premium = false;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token,secret);
    userId=decoded.userId;
    let findUser= await Orders.findOne({where: {userId: userId}})
    if(findUser!=null && findUser!=undefined){
        premium = true;
    }
    const user = await User.findOne({where:{id:userId}});
    res.status(200).json({userName:user.dataValues.userName, premium:premium});
}
catch(err){console.log(err);}
}


exports.getAllExpense= async (req, res, next) =>{
    try{
    
        const expense = await Expense.findAll({where:{userId:userId}});
        res.status(200).json(expense);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}



exports.addExpense= async (req, res, next) =>{
    const transaction = await sequelize.transaction();
    try{
        const expenseName = req.body.expenseName;
        const amount = req.body.amount;
        const category =req.body.category;
        const created= await Expense.create({ 
            expenseName: expenseName,
            amount: amount,
            category: category,    
            userId:userId

        },{transaction:transaction});
        if(created){
            const totalAmountRecord= await totalExpense.findOne({where:{userId:userId}});
            const finalAmount = Number(totalAmountRecord.dataValues.totalExpense) + Number(amount);
            await totalAmountRecord.update({totalExpense:finalAmount},{transaction:transaction});
            const updated= await totalAmountRecord.save();
            if(updated)
            {
                await transaction.commit();
                return res.status(201).json({ message: 'Expense added' });}
        else{
            await transaction.rollback();
            return res.status(500).json({ message: 'Expense not added' });   
        }
    }
        else{
            await transaction.rollback();
            return res.status(500).json({ message: 'Expense not added' });
        } 
       
    }catch(err){
        await transaction.rollback();
        res.status(500).json({message: err.message});
    }
}


exports.deleteExpense= async (req, res, next)=>{
    const transaction = await sequelize.transaction();
 try{
   
    const expenseId = req.params.id;
    const deletedRecord = await Expense.findByPk(expenseId);
    const amount = deletedRecord.dataValues.amount;
    const deleted = await Expense.destroy({
        where:{
            id: expenseId,
            userId:userId
        }
    },{transaction:transaction});
    if(deleted){
        const totalAmountRecord= await totalExpense.findOne({where:{userId:userId}});
        const finalAmont = Number(totalAmountRecord.dataValues.totalExpense) - Number(amount);
        await totalAmountRecord.update({totalExpense:finalAmont},{transaction:transaction});
        const updated=await totalAmountRecord.save();
        if(updated){
            await transaction.commit();
        return res.status(200).json({ message: 'Expense deleted' });
        }
        else{
            await transaction.rollback();
            return res.status(500).json({ message: 'Expense not deleted' });
        }
    }
    else{
        
        await transaction.rollback();
        return res.status(500).json({ message: 'Expense not deleted' });
    }
 }
 catch(err){
    await transaction.rollback();
     res.status(500).json({message: err.message});
 }   
}


exports.premiumTotalExpense = async (req, res, next)=>{
 try{
    const totalExpenseList = await totalExpense.findAll({attributes:[["userName","userName"],["totalExpense","totalExpense"]] ,order:[["totalExpense", "DESC"]]});
    if(totalExpenseList.length > 0)
    {
        res.status(200).json(totalExpenseList);
    }
    else{
        res.status(500).json({ message: 'No Expense' });
    }
 }
 catch(err){
     res.status(500).json({message: err.message});
 }   
}


exports.generateReport= async (req, res, next)=>{
    try{
       
       return res.status(200).json({message: 'Report'});
    }

    catch(err){
        return res.status(500).json({message: err.message});
    }
}