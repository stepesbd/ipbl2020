const express = require('express')

//Controllers
const PhysicianControler = require('./controllers/PhysicianController')

const routes = express.Router()


routes.get('/', PhysicianControler.index)


module.exports = routes
