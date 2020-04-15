const connection = require('../database')

module.exports = {
    async index(request, response) {
        const contacts = await connection('contacts').select('*')

        return response.json({ msg: contacts });
    },
    async show(request, response) {
        const { id } = request.params

        const [contact] = await connection('contacts').where('id', id).select()

        return response.status(200).json({ msg: contact })
    },
    async store(request, response) {
        const { name, crm, cpf } = request.body;

        const [id] = await connection('contacts').insert({
            name,
            crm,
            cpf
        })

        return response.status(201).json({ msg: { id, name, crm, cpf } })
    },
    async update(request, response) {
        const { id } = request.params

        const { name, crm, cpf } = request.body;

        const contact = await connection('contacts')
            .where('id', id)
            .update({
                name,
                crm,
                cpf
            })

        if (contact === 0) {
            return response.status(406).json({ error: 'contact not updated!' })
        }

        return response.status(200).json({ msg: { id, name, crm, cpf } })
    },
    async destroy(request, response) {
        const { id } = request.params

        const contact = await connection('contacts').where('id', id).delete()

        if (contact === 0) {
            return response.status(406).json({ error: 'contact not found!' })
        }

        return response.status(204).send()
    }
}
