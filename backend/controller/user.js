const express = require('express');

const User = require('../models/user');


exports.getRequest= async (req, res, next) => {
    res.status(201).redirect('/frontend/views/signup.html');
}

exports.userSignup= async function (req,res,next){
    try{
        const email = req.body.email;
        const userName = req.body.username;
        const password = req.body.password;
        const alreadyExists = await User.findOne({ where: { email:email } });
        if(alreadyExists!=null  && alreadyExists.dataValues.email == email){
            return res.status(400).json({ message: 'Email already exists' });
        }
        else
        {
            
            const created= await User.create({ 
                email: email,
                userName: userName,
                password: password});
            if(created){
                return res.status(201).json({ message: 'User created' });
            }
            else{
                return res.status(400).json({ message: 'User not created' });
            }    
            

        }
    }catch(err){
       console.log(err);
    }
}
