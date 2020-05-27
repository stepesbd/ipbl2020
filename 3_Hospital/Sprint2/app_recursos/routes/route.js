'use strict' 
const express = require('express');
const router = express.Router();
const controllerHospital = require('../controllers/hospital-controller')
const controllerProvider = require('../controllers/provider-controller')

module.exports = function(app) {
    router.get('/hospital/:user_id', controllerHospital.get);
    router.get('/hospital/:user_id/:page/', controllerHospital.get);
    router.get('/hospital/:user_id/:page/:mode', controllerHospital.get);
    router.post('/hospital/:user_id', controllerHospital.post);
    router.post('/hospital/:user_id/purchased/:type', controllerHospital.post);

    router.get('/fornecedor/:user_id', controllerProvider.get);
    router.get('/fornecedor/:user_id/:page/', controllerProvider.get);
    router.get('/fornecedor/:user_id/:page/:mode', controllerProvider.get);
    router.post('/fornecedor/:user_id/purchased', controllerProvider.post);
    router.post('/fornecedor/:user_id/new', controllerProvider.post);


    return router;
};
