'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/MongoDB/_procedures-controller')

module.exports = function(app) {
    router.get('/', controller.get);
    router.get('/New', controller.new);
    router.post('/', controller.post);
    router.get('/:proc_id', controller.get);
    router.post('/Update/:proc_id', controller.update);
    router.get('/Delete/:proc_id', controller.delete);
    return router;
};
