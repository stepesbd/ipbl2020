require('dotenv/config');
const faker = require('faker/locale/pt_BR');

const createAddresses = (id) => ({
  physicianId: id,
  type: 'local',
  zipcode: faker.address.zipCode(),
  state: faker.address.stateAbbr(),
  city: faker.address.city(),
  district: faker.address.city(),
  street: faker.address.streetName(),
  number: faker.random.number({
    min: 0,
    max: 1000,
  }),
});

exports.seed = async function (knex) {
  const fakeAdresses = [];
  const desiredFakeAdresses = process.env.Mock_QTD;
  for (let i = 1; i <= desiredFakeAdresses; i++) {
    fakeAdresses.push(createAddresses(i));
  }
  await knex('addresses').insert(fakeAdresses);
};
