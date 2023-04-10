const express = require('express');

const User = require('../models/user');

const totalExpense= require('../models/totalExpense');

const jwt= require('jsonwebtoken');

const secret = "secret_key";

const bcrypt = require('bcrypt');
const sequelize = require('../util/database');
const saltRounds=10;


exports.getSignupRequest= async (req, res, next) => {
    res.status(201).redirect('/frontend/views/signup.html');
}

exports.userSignup= async function (req,res,next){
    const transaction= await sequelize.transaction();
    try{
        const email = req.body.email;
        const userName = req.body.username;
        const password = req.body.password;
        const alreadyExists = await User.findOne({ where: { email:email } });
        if(alreadyExists!=null  && alreadyExists.dataValues.email == email){
            return res.status(201).json({ message: 'User already exists' });
        }
        else
        {
    
             bcrypt.hash(password, saltRounds, async (err,hash) => {
                if(err) 
                {console.log(err);}
                else
                {
                    const created= await User.create({ 
                        email: email,
                        userName: userName,
                        password: hash,
                        totalExpense:0
                    },{transaction:transaction});

                    if(created){
                        const user = await User.findOne({ where: { email:email } });
                        const totalExpUpdate = await totalExpense.create({
                            userId: user.dataValues.id,
                            userName:user.dataValues.userName,
                            totalExpense: 0

                        },{transaction:transaction});

                        if(totalExpUpdate){
                            await transaction.commit();
                            return res.status(201).json({ message: 'User created' });
                        }
                        else{
                            await transaction.rollback();
                            return res.status(500).json({ message: 'User not created' });
                        }
                    }
                    else{
                        await transaction.rollback();
                        return res.status(500).json({ message: 'User not created' });
                    }    
                }
            });
    
        }
    }catch(err){
        await transaction.rollback();
        return res.status(500).json({ message: 'User not created' });
    }
}


exports.getLoginRequest= async function(req,res,next){
    res.status(201).redirect('/frontend/views/login.html');
}


exports.userLogin = async function (req,res,next) {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ where: { email:email } });
        if(user!=null) 
        {   bcrypt.compare(password, user.dataValues.password,async (err, resolve)=>{
            if(err)
            {
                res.status(400).json({ message: 'Something went wrong' });
            }
            else if(resolve)
            {
                const payload = {
                    userId: user.dataValues.id,
                  };
                
                const token = jwt.sign(payload, secret);
                 

                res.status(200).json({ message: 'User logged in', token:token});
            }
            else
            {
                res.status(201).json({ message: 'Incorrect password' });
            }
        });
    }
        else{
            res.status(201).json({ message: 'incorrect username' });
        }
    }
    catch(err){
        return res.status(500).json({ message: 'User not loggedin' });
    }
}