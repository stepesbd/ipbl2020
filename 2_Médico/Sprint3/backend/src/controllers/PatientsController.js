const connection = require('../database');

module.exports = {
  async index(request, response) {
    const patients = await connection('patient').select('*');

    return response.json({ msg: patients });
  },

  async show(request, response) {
    const { id } = request.params;

    const [patient] = await connection('patient')
      .innerJoin('person', 'person.per_id', '=', 'patient.per_id')
      .where('patient.per_id', id)
      .select();

    return response.status(200).json({ msg: patient });
  },
};
