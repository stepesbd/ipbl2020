const connection = require('../database');

function escolherIndex(vector) {
  return Math.floor(Math.random() * vector.length);
}

module.exports = {
  async index(request, response) {
    const physicians = await connection('physicians').select('*').limit(100);

    return response.json({ msg: physicians });
  },
  async show(request, response) {
    const { id } = request.params;

    const [physician] = await connection('physicians').where('id', id).select();

    return response.status(200).json({ msg: physician });
  },
  async store(request, response) {
    const { name, crm, cpf } = request.body;

    const [id] = await connection('physicians').insert({
      name,
      crm,
      cpf,
    });

    return response.status(201).json({ msg: { id, name, crm, cpf } });
  },
  async update(request, response) {
    const { id } = request.params;

    const { name, crm, cpf } = request.body;

    const physician = await connection('physicians').where('id', id).update({
      name,
      crm,
      cpf,
    });

    if (physician === 0) {
      return response.status(406).json({ error: 'Physician not updated!' });
    }

    return response.status(200).json({ msg: { id, name, crm, cpf } });
  },
  async destroy(request, response) {
    const { id } = request.params;

    const physician = await connection('physicians').where('id', id).delete();

    if (physician === 0) {
      return response.status(406).json({ error: 'Physician not found!' });
    }

    return response.status(204).send();
  },
  async rand(request, response) {
    const physicians = [];
    for (i = 0; i < 5; i++) {
      const aux = await connection('physicians').select('*').limit();
      physicians.push(aux[escolherIndex(aux)]);
    }
    return response.json(physicians);
  },
};
