const connection = require('../database');

module.exports = {
  async index(request, response) {
    const addresses = await connection('addresses').select('*');

    return response.json({ msg: addresses });
  },
  async show(request, response) {
    const { id } = request.params;

    const [address] = await connection('addresses').where('id', id).select();

    return response.status(200).json({ msg: address });
  },
  async store(request, response) {
    const {
      physicianId,
      type,
      zipcode,
      state,
      city,
      district,
      street,
      number,
    } = request.body;

    const [id] = await connection('addresses').insert({
      physicianId,
      type,
      zipcode,
      state,
      city,
      district,
      street,
      number,
    });

    return response
      .status(201)
      .json({
        msg: {
          id,
          physicianId,
          type,
          zipcode,
          state,
          city,
          district,
          street,
          number,
        },
      });
  },
  async update(request, response) {
    const { id } = request.params;

    const {
      physicianId,
      type,
      zipcode,
      state,
      city,
      district,
      street,
      number,
    } = request.body;

    const address = await connection('addresses').where('id', id).update({
      physicianId,
      type,
      zipcode,
      state,
      city,
      district,
      street,
      number,
    });

    if (address === 0) {
      return response.status(406).json({ error: 'address not updated!' });
    }

    return response
      .status(200)
      .json({
        msg: {
          id,
          physicianId,
          type,
          zipcode,
          state,
          city,
          district,
          street,
          number,
        },
      });
  },
  async destroy(request, response) {
    const { id } = request.params;

    const address = await connection('addresses').where('id', id).delete();

    if (address === 0) {
      return response.status(406).json({ error: 'address not found!' });
    }

    return response.status(204).send();
  },
};
