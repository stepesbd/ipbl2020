const express = require('express');
const routes = express.Router();
require('express-group-routes');

//Controllers
const AddressController = require('../controllers/AddressController');
const ContactController = require('../controllers/ContactController');
const PhysicianController = require('../controllers/PhysicianController');
const PhysicianSpecialtyController = require('../controllers/PhysicianSpecialtyController');
const ProfileController = require('../controllers/ProfileController');
const SpecialtyController = require('../controllers/SpecialtyController');
const AttendanceController = require('../controllers/AttendanceController');

routes.group('/api', (router) => {
  //Addresses's routes
  router.get('/addresses', AddressController.index);
  router.get('/addresses/:id', AddressController.show);
  router.post('/addresses', AddressController.store);
  router.put('/addresses/:id', AddressController.update);
  router.delete('/addresses/:id', AddressController.destroy);

  //Contacts's routes
  router.get('/contacts', ContactController.index);
  router.get('/contacts/:id', ContactController.show);
  router.post('/contacts', ContactController.store);
  router.put('/contacts/:id', ContactController.update);
  router.delete('/contacts/:id', ContactController.destroy);

  //Physicians's routes
  router.get('/physicians', PhysicianController.index);
  router.get('/rand', PhysicianController.rand);
  router.get('/physicians/:id', PhysicianController.show);
  router.post('/physicians', PhysicianController.store);
  router.put('/physicians/:id', PhysicianController.update);
  router.delete('/physicians/:id', PhysicianController.destroy);

  //PhysicianSpecialty's routes
  router.get('/physicianspecialties', PhysicianSpecialtyController.index);
  router.get('/physicianspecialties/:id', PhysicianSpecialtyController.show);
  router.post('/physicianspecialties', PhysicianSpecialtyController.store);
  router.put('/physicianspecialties/:id', PhysicianSpecialtyController.update);
  router.delete(
    '/physicianspecialties/:id',
    PhysicianSpecialtyController.destroy
  );

  //Profiles's routes
  router.get('/profiles', ProfileController.index);
  router.get('/profiles/:id', ProfileController.show);
  router.post('/profiles', ProfileController.store);
  router.put('/profiles/:id', ProfileController.update);
  router.delete('/profiles/:id', ProfileController.destroy);

  //Specialties's routes
  router.get('/specialties', SpecialtyController.index);
  router.get('/specialties/:id', SpecialtyController.show);
  router.post('/specialties', SpecialtyController.store);
  router.put('/specialties/:id', SpecialtyController.update);
  router.delete('/specialties/:id', SpecialtyController.destroy);

  //Attendances's routes
  router.get('/attendances', AttendanceController.index);
  //router.get("/attendances/:id", AttendanceController.show)
  router.post('/attendances', AttendanceController.store);
  //router.put("/attendances/:attribute", AttendanceController.update)
  //router.delete("/attendances/:attribute", AttendanceController.destroy)
});

module.exports = routes;
