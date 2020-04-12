const express = require('express');
const routes = express.Router();

//Controllers
const PhysicianControler = require('./controllers/PhysicianController');

const routes = express.Router()

    routes.get("/physicians", PhysicianControler.index)
    routes.get("/physicians/:id", PhysicianControler.show)
    routes.post("/physicians", PhysicianControler.store)
    routes.put("/physicians/:id", PhysicianControler.update)
    routes.delete("/physicians/:id", PhysicianControler.destroy)


module.exports = routes;
