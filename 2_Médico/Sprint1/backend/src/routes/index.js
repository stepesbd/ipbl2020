const express = require('express');
const routes = express.Router();
require('express-group-routes');

//Controllers
const PhysicianControler = require('../controllers/PhysicianController');

routes.group("/api", (router) => {

    router.get("/physicians", PhysicianControler.index)
    router.get("/physicians/:id", PhysicianControler.show)
    router.post("/physicians", PhysicianControler.store)
    router.put("/physicians/:id", PhysicianControler.update)
    router.delete("/physicians/:id", PhysicianControler.destroy)

});

module.exports = routes;
