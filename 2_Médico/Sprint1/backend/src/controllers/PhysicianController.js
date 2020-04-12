const connection = require('../database')

module.exports = {
    async index(request, response) {
        return response.json({msg: 'Hello World !'});
    },
    async show(request, response){
        return response.json({msg: 'Hello World !'}); 
    },
    async store(request, response) {
        return response.json({msg: 'Hello World !'});
    },
    async update(request, response){
        return response.json({msg: 'Hello World !'});
    },
    async destroy(request,response){
        return response.json({msg: 'Hello World !'});
    }
}