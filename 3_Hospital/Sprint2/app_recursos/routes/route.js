'use strict' 

const express = require('express');
const router = express.Router();

/*
const controller = require('../controllers/MongoDB/controller')
module.exports = function(app) {
    router.get('/:user/:user_id', controller.get);
    router.get('/:user/:user_id/:page/', controller.get);
    router.get('/:user/:user_id/:page/:mode', controller.get);
    router.post('/:user/:user_id', controller.post);
    //router.get('/:hos_cnes_code/:new/:fornecedor_id/', controller.get);
    //router.post('/:hos_cnes_code/:new/:fornecedor_id/:material_id', controller.post);
    //router.post('/Update/edit/:id', controller.update);
    //router.get('/Delete/:id', controller.delete);
    return router;
};
*/


const controller = require('../controllers/MySQL/controller')
module.exports = function(app) {
    router.get('/:user/:user_id', controller.get);
    router.get('/:user/:user_id/:page/', controller.get);
    router.get('/:user/:user_id/:page/:mode', controller.get);
    router.post('/:user/:user_id', controller.post);
    //router.get('/:hos_cnes_code/:new/:fornecedor_id/', controller.get);
    //router.post('/:hos_cnes_code/:new/:fornecedor_id/:material_id', controller.post);
    //router.post('/Update/edit/:id', controller.update);
    //router.get('/Delete/:id', controller.delete);
    return router;
};
