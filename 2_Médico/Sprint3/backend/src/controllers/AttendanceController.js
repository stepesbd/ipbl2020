const connection = require('../database');

module.exports = {
  async index(request, response) {
    const attendances = await connection('attendance')
      .innerJoin('physicians', 'physicians.id', '=', 'attendance.med_id')
      .innerJoin('person', 'person.per_id', '=', 'attendance.per_id')
      .select();

    const serializedAttendances = attendances.map((attendance) => {
      return {
        att_id: attendance.att_id,
        att_date: attendance.att_date,
        att_pre_symptoms: attendance.att_pre_symptoms,
        att_description: attendance.att_description,
        hos_id: attendance.hos_id,
        physician: {
          id: attendance.id,
          publicKey: attendance.publicKey,
          privateKey: attendance.privateKey,
          name: attendance.name,
          crm: attendance.crm,
          cpf: attendance.cpf,
          status: attendance.status,
        },
        patient: {
          per_id: attendance.per_id,
          per_first_name: attendance.per_first_name,
          per_last_name: attendance.per_last_name,
          per_birth: attendance.per_birth,
          per_email: attendance.per_email,
          per_cpf: attendance.per_cpf,
          add_id: attendance.add_id,
          per_nickname: attendance.per_nickname,
          per_senha: attendance.per_senha,
          per_public_key: attendance.per_public_key,
          per_private_key: attendance.per_private_key,
        },
      };
    });

    return response.json({ msg: serializedAttendances });
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
