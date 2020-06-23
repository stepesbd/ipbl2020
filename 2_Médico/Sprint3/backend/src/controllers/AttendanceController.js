const connection = require('../database');

module.exports = {
  async index(request, response) {
    const attendances = await connection('attendance').select('*');

    return response.json({ msg: attendances });
  },

  async show(request, response) {
    const { id } = request.params;

    const [attendance] = await connection('attendance')
      .where('att_id', id)
      .select();

    return response.status(200).json({ msg: attendance });
  },

  async store(request, response) {
    const { name } = request.body;

    const [att_date] = await connection('attendance').insert({
      att_date,
      att_pre_symptoms,
      att_description,
      hos_id,
      med_id,
      per_id,
    });

    return response.status(201).json({ msg: { id, name } });
  },

  async update(request, response) {
    const { id } = request.params;

    const { name } = request.body;

    const specialty = await connection('attendance')
      .where('att_date', id)
      .update({
        att_date,
        att_pre_symptoms,
        att_description,
        hos_id,
        med_id,
        per_id,
      });

    if (specialty === 0) {
      return response.status(406).json({ error: 'specialty not updated!' });
    }

    return response.status(200).json({ msg: { id, name } });
  },

  async destroy(request, response) {
    const { id } = request.params;

    const specialty = await connection('specialties').where('id', id).delete();

    if (specialty === 0) {
      return response.status(406).json({ error: 'specialty not found!' });
    }

    return response.status(204).send();
  },
};
