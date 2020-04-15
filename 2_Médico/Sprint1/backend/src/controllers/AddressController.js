const connection = require('../database')

module.exports = {
    async index(request, response) {
        const addresses = await connection('addresses').select('*')

        return response.json({ msg: addresses });
    },
    async show(request, response) {
        const { id } = request.params

        const [address] = await connection('addresses').where('id', id).select()

        return response.status(200).json({ msg: address })
    },
    async store(request, response) {
        const { name, crm, cpf } = request.body;

        const [id] = await connection('addresses').insert({
            name,
            crm,
            cpf
        })

        return response.status(201).json({ msg: { id, name, crm, cpf } })
    },
    async update(request, response) {
        const { id } = request.params

        const { name, crm, cpf } = request.body;

        const address = await connection('addresses')
            .where('id', id)
            .update({
                name,
                crm,
                cpf
            })

        if (address === 0) {
            return response.status(406).json({ error: 'address not updated!' })
        }

        return response.status(200).json({ msg: { id, name, crm, cpf } })
    },
    async destroy(request, response) {
        const { id } = request.params

        const address = await connection('addresses').where('id', id).delete()

        if (address === 0) {
            return response.status(406).json({ error: 'address not found!' })
        }

        return response.status(204).send()
    }
}
