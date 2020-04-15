const connection = require('../database')

module.exports = {
    async index(request, response) {
        const specialties = await connection('specialties').select('*')

        return response.json({ msg: specialties });
    },
    async show(request, response) {
        const { id } = request.params

        const [specialty] = await connection('specialties').where('id', id).select()

        return response.status(200).json({ msg: specialty })
    },
    async store(request, response) {
        const { name, crm, cpf } = request.body;

        const [id] = await connection('specialties').insert({
            name,
            crm,
            cpf
        })

        return response.status(201).json({ msg: { id, name, crm, cpf } })
    },
    async update(request, response) {
        const { id } = request.params

        const { name, crm, cpf } = request.body;

        const specialty = await connection('specialties')
            .where('id', id)
            .update({
                name,
                crm,
                cpf
            })

        if (specialty === 0) {
            return response.status(406).json({ error: 'specialty not updated!' })
        }

        return response.status(200).json({ msg: { id, name, crm, cpf } })
    },
    async destroy(request, response) {
        const { id } = request.params

        const specialty = await connection('specialties').where('id', id).delete()

        if (specialty === 0) {
            return response.status(406).json({ error: 'specialty not found!' })
        }

        return response.status(204).send()
    }
}
