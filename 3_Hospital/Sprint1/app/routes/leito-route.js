'use strict'

const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/leito-controller')

module.exports = function(app) {
    router.get('/list', controller.get);
    router.get('/records/:bed_id', controller.get);
    router.post('/records/:bed_id/:action', controller.post);
    router.get('/New', controller.new);
    router.post('/', controller.post);
    router.post('/Update/:bed_id', controller.update);
    router.get('/Delete/:bed_id', controller.delete);
    //router.post('/Update/:employee_id', controller.update);
    return router;
};
