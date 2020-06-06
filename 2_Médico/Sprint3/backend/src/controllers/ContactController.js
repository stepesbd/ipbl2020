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
        const { physicianId, type, contact } = request.body;

        const [id] = await connection('contacts').insert({
            physicianId,
            type,
            contact
        })

        return response.status(201).json({ msg: { id, physicianId, type, contact } })
    },
    async update(request, response) {
        const { id } = request.params

        const { physicianId, type, contact } = request.body;

        const result = await connection('contacts')
            .where('id', id)
            .update({
                physicianId,
                type,
                contact
            })

        if (result === 0) {
            return response.status(406).json({ error: 'contact not updated!' })
        }

        return response.status(200).json({ msg: { id, physicianId, type, contact } })
    },
    async destroy(request, response) {
        const { id } = request.params

        const result = await connection('contacts').where('id', id).delete()

        if (result === 0) {
            return response.status(406).json({ error: 'contact not found!' })
        }

        return response.status(204).send()
    }
}
