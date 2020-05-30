const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const rabbitMQ = require('./services/rabbitMQ')

app.use(cors({ origin: "*" }));
app.use(express.json());


const amqpClient = new rabbitMQ();
mqttClient.connect()

app.use((request, response, next) => {
    request.amqp = amqpClient;
    return next();
})


app.use(routes);

module.exports = app;
