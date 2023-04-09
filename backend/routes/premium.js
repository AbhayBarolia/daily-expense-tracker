const express = require('express');

const routes = express();

const premium = require('../controller/premium');

routes.get('/getuser',premium.getUser);

routes.get('/payment',premium.processPayment);

routes.post('/updatepaymentstatus',premium.successfulPayment);



module.exports = routes;