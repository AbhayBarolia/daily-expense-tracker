const express = require('express');

const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRounds=10;


exports.getSignupRequest= async (req, res, next) => {
    res.status(201).redirect('/frontend/views/signup.html');
}

exports.userSignup= async function (req,res,next){
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
                        password: hash});
                    if(created){
                        return res.status(201).json({ message: 'User created' });
                    }
                    else{
                        return res.status(201).json({ message: 'User not created' });
                    }    
                }
            });
    
        }
    }catch(err){
       console.log(err);
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
                res.status(200).json({ message: 'User logged in',id:user.dataValues.id});
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
        console.log(err);
    }
}