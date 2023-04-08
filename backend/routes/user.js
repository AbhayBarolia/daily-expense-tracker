const express = require('express');

const routes = express();

const user = require('../controller/user');

routes.get('/',user.getRequest);
routes.post('/signup',user.userSignup);




module.exports =routes;