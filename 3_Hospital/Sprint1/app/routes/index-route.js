'use strict' 

const express = require('express');
const router = express.Router();
const controller = require('../controllers/index-controller')

module.exports = function(app) {
    router.get('/', controller.get);
    router.get('/api/:api', controller.get);
    return router;
};