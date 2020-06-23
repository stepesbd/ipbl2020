const connection = require('../database');

module.exports = {
  async index(request, response) {
    const results = await connection('physicians').select('*');

    return response.json({ msg: results });
  },

  async show(request, response) {
    const { id } = request.params;

    const [physician] = await connection('physicians').where('id', id).select();

    const addresses = await connection('addresses')
      .where('physicianId', id)
      .select();

    const contacts = await connection('contacts')
      .where('physicianId', id)
      .select();

    const specialties = await connection('physician_specialties')
      .join(
        'specialties',
        'specialties.id',
        '=',
        'physician_specialties.specialtiesId'
      )
      .where('physicianId', id)
      .select(['physician_specialties.*', 'specialties.name']);

    return response
      .status(200)
      .json({ msg: { physician, addresses, contacts, specialties } });
  },
  async store(request, response) {
    return response.json({ msg: 'Hello World!' });
  },
  async update(request, response) {
    return response.json({ msg: 'Hello World!' });
  },
  async destroy(request, response) {
    return response.json({ msg: 'Hello World!' });
  },
};
