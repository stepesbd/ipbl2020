const connection = require('../database')

module.exports = {
    async index(request, response) {
        return response.json({msg: 'Hello World !'});
    }
}