'use strict' 
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')
const controllerAPI = require('../controllers/controllerAPI')
const controllerMAP = require('../controllers/controllerMAP')
const controllerMONIT = require('../controllers/controllerMONIT')


module.exports = function(app) {
    router.get('/', controller.get);
    router.post('/', controller.post);
    router.get('/monitoring', controllerMONIT.get);
    router.get('/monitoring/:id', controllerMONIT.get);
    router.get('/monitoring/:id/:action', controllerMONIT.get);
    router.post('/monitoring/:id', controllerMONIT.post);
    router.post('/monitoring/:id/:action', controllerMONIT.post);
    router.get('/map/', controllerMAP.get);
    router.get('/map/:request', controllerMAP.get);
    router.post('/attendance/:step', controller.get);
    router.get('/attendance/:step', controller.get);
    router.get('/api/', controllerAPI.get);        // ROTA PARA BASE DE SOLICITAÇÕES À API
    router.get('/api/:type', controllerAPI.get);        
    router.get('/api/:type/:id1', controllerAPI.get);    // ROTA PARA PRIMEIRO TIPO DE IDENTIFICAÇÃO
    router.post('/api/:type/:id1/:id2', controllerAPI.post);    // ROTA PARA SEGUNDO TIPO DE IDENTIFICAÇÃO
    return router;
};
