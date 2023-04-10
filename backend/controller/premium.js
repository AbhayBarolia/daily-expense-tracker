const express = require('express');
const Razorpay= require('razorpay');
const Expense = require('../models/expense');

const Orders = require('../models/orders');
const User = require('../models/user');

const jwt=require('jsonwebtoken');
const sequelize = require('../util/database');
const secret = "secret_key";

let userId;
let user;
let premium = false; 

exports.getUser= async function(req, res, next) {
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        userId=decoded.userId;
        if(Orders.findOne({where: {userId: userId}})){
            premium = true;
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
    key_id:  'rzp_test_YnjLsh1aGCKVlo',
    key_secret: 'IKFVFuu0wcNcf0qAN9bL9RuE'
});


    await rzp.orders.create({amount, currency: 'INR'},async (err, order) =>{
    if(err){
        return res.status(500).json({message: err});
    }
    else
    {
        const order =  await User.createOrder({orderId:order.id, status:'PENDING', paymentId:"WAITING"},{transaction: transaction});
       if(order) {
        await transaction.commit();
        return res.status(201).json({order, key_id:rzp.key_id});
    }
    else{
        await transaction.rollback();
        return res.status(500).json({message: "Something went wrong"});
    }
    }})

}
catch(err){
    await transaction.rollback();
    return res.status(500).json({message: err});
}
}




exports.successfulPayment= async (req,res,next) =>{
const updatedorder = await Orders.findOne({where:{orderId:req.body.order_id}})
if(updatedorder){
await updatedorder.set({staus:"SUCCESS",paymentId:req.body.payment_id});
await updatedorder.save();
return res.status(201).json({payment:"SUCCESS"});
}
};