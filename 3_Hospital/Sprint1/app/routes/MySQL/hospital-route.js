'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/MySQL/hospital-controller')

module.exports = function(app) {
    router.get('/', controller.get);                            
    router.get('/New', controller.new);                         
    router.post('/Procs/:hosp_id', controller.post);            
    router.post('/', controller.post);                          
    router.get('/:id', controller.get);                         
    router.post('/Update/:id/:ProcsUpdate', controller.update); 
    router.get('/Delete/:id', controller.delete);
    router.post('/Update/:id', controller.update);               
    router.get('/Procs/:hos_med_proc_id', controller.get);      
    return router;
};
