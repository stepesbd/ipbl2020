const express = require('express');
const routes = express.Router();
require('express-group-routes');

//Controllers
const PhysicianControler = require('../controllers/PhysicianController');
const AddressController = require('../controllers/AddressController');

routes.group("/api", (router) => {

    //Physicians's routes
    router.get("/physicians", PhysicianControler.index)
    router.get("/physicians/:id", PhysicianControler.show)
    router.post("/physicians", PhysicianControler.store)
    router.put("/physicians/:id", PhysicianControler.update)
    router.delete("/physicians/:id", PhysicianControler.destroy)

    //Addresses's routes
    router.get("/addresses", AddressController.index)
    router.get("/addresses/:id", AddressController.show)
    router.post("/addresses", AddressController.store)
    router.put("/addresses/:id", AddressController.update)
    router.delete("/addresses/:id", AddressController.destroy)

});

module.exports = routes;
