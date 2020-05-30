var mqtt = require('mqtt')

module.exports = {
    async index(request, response) {

    },

    async store(request, response) {
        await request.amqp.publisher(JSON.stringify(request.body))
    }
}