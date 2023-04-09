const express = require('express');
const Razorpay= require('razorpay');
const Expense = require('../models/expense');

const Orders = require('../models/orders');
const User = require('../models/user');

const jwt=require('jsonwebtoken');
const secret = "secret_key";

let userId;
let user;

exports.getUser= async function(req, res, next) {
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        userId=decoded.userId;
        user = await User.findOne({where:{id:userId}});
        res.status(200).json({userName:user.dataValues.userName});
    }
    catch(err){console.log(err);}
    }


exports.processPayment= async function(req, res, next) {
const amount = 100;
const rzp = new Razorpay({
    key_id:  'rzp_test_v8fKp4BftpWrj5',
    key_secret: 'CbTIKgf1xQ1iuS8WOS79j9Yo'
});


    rzp.orders.create({amount, currency: 'INR'},(err, order) =>{
    if(err){
        console.log(err);
    }
    else
    {
        user.createOrder({orderId:order.id, status:'PENDING', paymentId:"WAITING"}).then(()=> {
        return res.status(201).json({order, key_id:rzp.key_id});
    }).catch((err) => {
        console.log(err);
    })

}
})};



exports.successfulPayment= async (req,res,next) =>{
const updatedorder = await Orders.findOne({where:{orderId:req.body.order_id}})
if(updatedorder){
await updatedorder.set({staus:"SUCCESS",paymentId:req.body.payment_id});
await updatedorder.save();
return res.status(201).json({payment:"SUCCESS"});
}
};