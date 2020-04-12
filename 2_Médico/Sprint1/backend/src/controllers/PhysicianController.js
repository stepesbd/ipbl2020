const connection = require('../database')

module.exports = {
    async index(request, response) {
        const physicians = await connection('physicians')
        return response.json('Hello World !')
    }
}