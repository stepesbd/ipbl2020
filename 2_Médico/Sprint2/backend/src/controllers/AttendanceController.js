const ack_queue = 'ts2-backend'

module.exports = {
    async index(request, response) {
        const operation = 'get'
        const attribute = "all"
        data = {
            operation,
            ack_queue,
            attribute
        }
        await request.amqp.publisher(JSON.stringify(data))
        let result = await request.amqp.consumer();
        return response.json(result)
    },

    async show(request, response) {
        const operation = 'get'
    },

    async store(request, response) {
        const operation = 'insert'
        const { physicianId, patId, symptoms, diagnosis } = request.body;
        let data = {
            operation,
            ack_queue,
            physicianId,
            patId,
            symptoms,
            diagnosis,
            newAttendance: null,
            status: true
        }
        await request.amqp.publisher(JSON.stringify(data))
        let result = await request.amqp.consumer()
        return response.json(result)
    },

    async update(request, response) {
        const operation = 'update'
    },

    async destroy(request, response) {
        const operation = 'delete'
    }
}