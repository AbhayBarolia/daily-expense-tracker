const express = require('express');

const routes = express();

const user = require('../controller/user');

routes.get('/signup',user.getSignupRequest);
routes.post('/signup',user.userSignup);

routes.get('/login',user.getLoginRequest);
routes.post('/login',user.userLogin);




module.exports =routes;