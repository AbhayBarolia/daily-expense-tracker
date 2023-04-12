const express = require('express');

const routes = express();

const user = require('../controller/user');

routes.get('/signup',user.getSignupRequest);
routes.post('/signup',user.userSignup);

routes.get('/login',user.getLoginRequest);
routes.post('/login',user.userLogin);

routes.get('/resetpassword/:uuid',user.getNewPasswordRequest);
routes.post('/resetpassword',user.resetPasswordRequest);

routes.post('/newpassword',user.newPasswordRequest);



module.exports =routes;