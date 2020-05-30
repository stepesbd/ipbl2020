const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const rabbitMQ = require('./services/rabbitMQ')

app.use(cors({ origin: "*" }));
app.use(express.json());



app.use(async (request, response, next) => {
    request.amqp = rabbitMQ;
    return next();
})


app.use(routes);

module.exports = app;
