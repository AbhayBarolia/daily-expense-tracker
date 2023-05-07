const express = require('express');

const AWS= require('aws-sdk');

const Expense = require('../models/expense');
const User = require('../models/user');
const Orders= require('../models/orders');
const totalExpense= require('../models/totalExpense');
const fileRecords = require('../models/fileRecord');

require('dotenv').config();

const jwt=require('jsonwebtoken');
const sequelize = require('../util/database');
const secret = process.env.SECRET_KEY;



let userId;
let premium;


exports.getUser= async function(req, res, next) {
try{
    premium = false;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token,secret);
    userId=decoded.userId;
    const userData=await Orders.findOne({where: {userId: userId, status:"SUCCESS"}});
        if(userData!=null&& userData!=undefined && userData.dataValues.status=="SUCCESS"){
            premium = true;
        }
        else{
            premium = false;
        }
    const user = await User.findOne({where:{id:userId}});
    res.status(200).json({userName:user.dataValues.userName, premium:premium});
}
catch(err){console.log(err);}
}


exports.getAllExpense= async (req, res, next) =>{
    try{
        const token = req.headers.authorization;
        const decoded = await jwt.verify(token,secret);
        userId=decoded.userId;
        let totalPages= await Expense.findAndCountAll({where: {userId:userId}});
        let page =Number(req.params.page);
        let pageSize=Number(req.params.offset);
        let pages=Math.ceil(totalPages.count/2);
        let offset=pageSize * (page - 1);
        

        const expense = await Expense.findAll(
              {
                where: {userId:userId},
                limit:pageSize,
                offset:offset
              }      
            );
        res.status(200).json({expense, totalPages:pages});
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

async function uploadToS3(data, filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY= process.env.IAM_USER_KEY;
    const IAM_USER_SECRET= process.env.IAM_USER_SECRET;


    let s3Bucket = await new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
        
    });

   
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body:data,
            ACL:'public-read'
        }
        return new Promise((resolve, reject) => {
            s3Bucket.upload(params,async (err, s3response)=>{
                if (err) {
                 reject(err);
                }        
                else{
                 
                 resolve(s3response.Location);
                }
             });
        });
       
}


exports.generateReport= async (req, res, next)=>{
    const transaction = await sequelize.transaction();
    try{ 
       const expenses = await Expense.findAll({where:{userId:userId}});
       const stringExpenses = JSON.stringify(expenses);
       const filename= `Report${userId}/${new Date()}.txt`;
       const fileURL = await uploadToS3(stringExpenses, filename);
       const fileRecord= await fileRecords.create({
        userId:userId,
        fileLink:fileURL
       },{transaction:transaction});
       if(fileRecord){
       transaction.commit(); 
       return res.status(200).json({fileURL, success:true});
       }
       else{
        transaction.rollback();
        return res.status(500).json({message: "error occured"});
       }
    }

    catch(err){
        await transaction.rollback();
        return res.status(500).json({message: err.message});
    }
}

exports.reportRecords = async (req,res,next)=>{
 try{
    const token = req.headers.authorization;
    const decoded = jwt.verify(token,secret);
    userId=decoded.userId;
    const fr = await fileRecords.findAll({where:{userId:userId}, attributes:['fileLink']});
    if(fr)
    {
        return res.status(200).json({fr});
    }
 } 
 catch(err){
    return res.status(500).json({message: err.message});
}  
}