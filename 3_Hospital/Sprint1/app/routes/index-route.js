'use strict' 

const express = require('express');
const router = express.Router();
const controller = require('../controllers/index-controller')
const controllerAPI = require('../controllers/API-controller')

module.exports = function(app) {
    router.get('/', controller.get);
    router.get('/api', controllerAPI.get);
    router.get('/api/:hosp_list', controllerAPI.get);
    return router;
};