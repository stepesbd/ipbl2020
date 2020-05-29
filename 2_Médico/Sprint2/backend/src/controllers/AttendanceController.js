var mqtt = require('mqtt')

module.exports = {
    async index(request, response) {

    },

    async store(request, response) {
        request.mqttClient.sendMessage(request.body.message)
        response.status(200).send("teste")
    }
}