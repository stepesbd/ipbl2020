module.exports = {
    async index(request, response) {
        return response.json({msg: 'Hello World !'});
    }
}