const connection = require('../database')

module.exports = {
    async index(request, response) {
        const physicianSpecialties = await connection('physician_specialties').select('*')

        return response.json({ msg: physicianSpecialties });
    },
    async show(request, response) {
        const { id } = request.params

        const [physician_specialty] = await connection('physician_specialties').where('id', id).select()

        return response.status(200).json({ msg: physicianSpecialty })
    },
    async store(request, response) {
        const { name, crm, cpf } = request.body;

        const [id] = await connection('physician_specialties').insert({
            name,
            crm,
            cpf
        })

        return response.status(201).json({ msg: { id, name, crm, cpf } })
    },
    async update(request, response) {
        const { id } = request.params

        const { name, crm, cpf } = request.body;

        const physicianSpecialty = await connection('physician_specialties')
            .where('id', id)
            .update({
                name,
                crm,
                cpf
            })

        if (physician_specialty === 0) {
            return response.status(406).json({ error: 'physician_specialty not updated!' })
        }

        return response.status(200).json({ msg: { id, name, crm, cpf } })
    },
    async destroy(request, response) {
        const { id } = request.params

        const physicianSpecialty = await connection('physician_specialties').where('id', id).delete()

        if (physician_specialty === 0) {
            return response.status(406).json({ error: 'physician_specialty not found!' })
        }

        return response.status(204).send()
    }
}
