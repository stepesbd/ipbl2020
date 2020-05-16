'use strict' 
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')

module.exports = function(app) {
    router.get('/:user/:user_id', controller.get);
    router.get('/:user/:user_id/:page/', controller.get);
    router.get('/:user/:user_id/:page/:mode', controller.get);
    router.post('/:user/:user_id', controller.post);
    return router;
};
