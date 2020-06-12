const faker = require('faker');
const faker = require('faker/locale/pt_BR');

const createPhysicians = () => ({
  name: faker.name.findName(),
  crm: `${faker.random.number()}-${faker.address.stateAbbr()}`,
  cpf: faker.random.number({
    min: 10000000000,
    max: 99999999999,
  }),
});

exports.seed = async function (knex) {
  const fakePhysicians = [];
  const desiredFakePhysicians = 1000;
  for (let i = 0; i < desiredFakePhysicians; i++) {
    fakePhysicians.push(createPhysicians());
  }
  await knex('physicians').insert(fakePhysicians);
};
