require('dotenv/config');
const faker = require('faker/locale/pt_BR');
const bigchain = require('bigchaindb-driver');

const createPhysicians = () => {
  const keys = new bigchain.Ed25519Keypair();

  return {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    name: faker.name.findName(),
    crm: `${faker.random.number({
      min: 10000,
      max: 100000,
    })}-${faker.address.stateAbbr()}`,
    cpf: faker.random.number({
      min: 10000000000,
      max: 99999999999,
    }),
  };
};

exports.seed = async function (knex) {
  const fakePhysicians = [];
  const desiredFakePhysicians = process.env.Mock_QTD;
  for (let i = 0; i < desiredFakePhysicians; i++) {
    fakePhysicians.push(createPhysicians());
  }
  await knex('physicians').insert(fakePhysicians);
};
