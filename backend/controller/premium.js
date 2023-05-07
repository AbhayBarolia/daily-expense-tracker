const express = require('express');
const Razorpay= require('razorpay');
const Expense = require('../models/expense');

const Orders = require('../models/orders');
const User = require('../models/user');

const jwt=require('jsonwebtoken');
const sequelize = require('../util/database');

require('dotenv').config();
const secret = process.env.SECRET_KEY;

let userId;
let user;
let premium = false; 

exports.getUser= async function(req, res, next) {
    try{
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
        user = await User.findOne({where:{id:userId}});
        res.status(200).json({userName:user.dataValues.userName, premium:premium });
    }
    catch(err){console.log(err);}
    }


exports.processPayment= async function(req, res, next) {
    const transaction = await sequelize.transaction();
    try{
    const amount = 100;
    const rzp = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});


    await rzp.orders.create({amount, currency: 'INR'},async (err, orderTrans) =>{
    if(err){
        return res.status(500).json({message: err});
    }
    else
    {   
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        userId=decoded.userId;
        const order =  await Orders.create({orderId:orderTrans.id, status:'PENDING', paymentId:"WAITING", userId:userId},{transaction: transaction});
        if(order) {
        await transaction.commit();
        return res.status(201).json({order, key_id:rzp.key_id});
        }
    else{
        await transaction.rollback();
        return res.status(500).json({message: "Something went wrong"});
        }
    }
})

}
catch(err){
    await transaction.rollback();
    return res.status(500).json({message: err});
}
}




exports.successfulPayment= async (req,res,next) =>{
    
const updatedorder = await Orders.findOne({where:{orderId:req.body.order_id}})
if(updatedorder){
await updatedorder.set({status:"SUCCESS",paymentId:req.body.payment_id});
await updatedorder.save();
return res.status(201).json({payment:"SUCCESS"});
}
};