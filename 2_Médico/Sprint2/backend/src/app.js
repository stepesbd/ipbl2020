const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const MqttHandler = require('./services/MqttHandler')

app.use(cors({ origin: "*" }));
app.use(express.json());

const mqttClient = new MqttHandler();
mqttClient.connect('mqtt2mongo');

app.use((request, response, next) => {
    request.mqttClient = mqttClient;
    return next();
})

app.use(routes);

module.exports = app;
