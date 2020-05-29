require('dotenv/config');
const request = require('supertest');
const app = require('./app');
const connection = require('./database');

const testPhysician = {
  name: "João",
  crm: "123485",
  cpf: "45103412302",
}
const testSpecialty = {
  name: "specialty123"
}
let testPhysicianId;
let testSpecialtyId;

async function waitForId(pendingId, isToDelete, toDeleteCounter) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (pendingId && (!isToDelete || toDeleteCounter === 0)) {
        resolve(pendingId);
        clearInterval(interval);
      } else if (pendingId === null) {
        reject(new Error("Missing id"));
      }
    }, 100);
  });
}

async function createTestPhysician() {
  const [id] = await connection('physicians').insert(testPhysician);
  testPhysicianId = id;
}

async function deleteTestPhysician() {
  await connection('physicians').where('id', testPhysicianId).delete()
}

async function createTestSpecialty() {
  const [id] = await connection('specialties').insert(testSpecialty);
  testSpecialtyId = id;
}

async function deleteTestSpecialty() {
  await connection('specialties').where('id', testSpecialtyId).delete()
}

async function getTestPhysicianId() {
  return (await connection('physicians')
    .select('id')
    .where('cpf', '45103412302'))[0].id;
}

async function getTestSpecialtyId() {
  return (await connection('specialties')
    .select('id')
    .where('name', 'specialty123'))[0].id;
}

beforeAll(async () => {
  await createTestPhysician();
  await createTestSpecialty();
});

afterAll(async () => {
  await deleteTestPhysician();
  await deleteTestSpecialty();
});


describe('Test physicians routes', () => {
  const newPhysician = {
    name: "Fulano da Silva",
    crm: "2313423-24134",
    cpf: "85303412301",
  }
  let physicianId = undefined;
  let toDeleteCounter = 4;
  const baseEndpoint = "/api/physicians";

  test('Creating a new physician', async () => {
    const response = await request(app)
      .post(baseEndpoint)
      .send(newPhysician);
    const body = response.body;

    expect(response.statusCode).toBe(201);
    expect(body.msg).toEqual(
      expect.objectContaining(newPhysician)
    );

    physicianId = body.msg.id ? body.msg.id : null;
    toDeleteCounter--;
  });

  test('Get the created physician', async () => {
    const id = await waitForId(physicianId);
    const response = await request(app).get(`${baseEndpoint}/${id}`);
    const body = response.body;
    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining(newPhysician)
    );

    toDeleteCounter--;
  });

  test('Get the physicians', async () => {
    response = await request(app).get(baseEndpoint);
    expect(response.statusCode).toBe(200);
    response.body.msg.map(item => {
      expect(item).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        crm: expect.any(String),
        cpf: expect.any(String),
      })
    });

    toDeleteCounter--;
  });

  test('Update the physician', async () => {
    const id = await waitForId(physicianId);
    const updates = {
      name: "Fulano da Silva Brandão",
      crm: "23134-2324134",
      cpf: "85303412301"
    }
    const response = await request(app)
      .put(`${baseEndpoint}/${id}`)
      .send(updates);
    const body = response.body;

    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining({ ...newPhysician, ...updates })
    );

    toDeleteCounter--;
  });

  test('Delete the physician', async () => {
    const id = await waitForId(physicianId, true, toDeleteCounter);
    const response = await request(app)
      .delete(`${baseEndpoint}/${id}`);

    expect(response.statusCode).toBe(204);
  });
});


describe('Test specialties routes', () => {
  const newSpecialty = {
    name: "foo",
  }
  let specialtyId = undefined;
  let toDeleteCounter = 4;
  const baseEndpoint = "/api/specialties";

  test('Creating a new specialty', async () => {
    const response = await request(app)
      .post(baseEndpoint)
      .send(newSpecialty);
    const body = response.body;

    expect(response.statusCode).toBe(201);
    expect(body.msg).toEqual(
      expect.objectContaining(newSpecialty)
    );

    specialtyId = body.msg.id ? body.msg.id : null;
    toDeleteCounter--;
  });

  test('Get the created specialty', async () => {
    const id = await waitForId(specialtyId);
    const response = await request(app).get(`${baseEndpoint}/${id}`);
    const body = response.body;
    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining(newSpecialty)
    );

    toDeleteCounter--;
  });

  test('Get the specialties', async () => {
    response = await request(app).get(baseEndpoint);
    expect(response.statusCode).toBe(200);
    response.body.msg.map(item => {
      expect(item).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
      })
    });

    toDeleteCounter--;
  });

  test('Update the specialty', async () => {
    const id = await waitForId(specialtyId);
    const updates = {
      name: "bar",
    }
    const response = await request(app)
      .put(`${baseEndpoint}/${id}`)
      .send(updates);
    const body = response.body;

    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining({ ...newSpecialty, ...updates })
    );

    toDeleteCounter--;
  });

  test('Delete the specialty', async () => {
    const id = await waitForId(specialtyId, true, toDeleteCounter);
    const response = await request(app).delete(`${baseEndpoint}/${id}`);

    expect(response.statusCode).toBe(204);
  });
});


describe('Test physician specialty routes', () => {
  let physicianSpecialtyId = undefined;
  let toDeleteCounter = 3;
  const baseEndpoint = "/api/physicianspecialties";

  test('Creating a new physician specialty', async () => {
    const newPhysicianSpecialty = {
      physicianId: await getTestPhysicianId(),
      specialtiesId: await getTestSpecialtyId(),
    };

    const response = await request(app)
      .post(baseEndpoint)
      .send(newPhysicianSpecialty);
    const body = response.body;

    expect(response.statusCode).toBe(201);
    expect(body.msg).toEqual(
      expect.objectContaining(newPhysicianSpecialty)
    );

    physicianSpecialtyId = body.msg.id ? body.msg.id : null;
    toDeleteCounter--;
  });

  test('Get the created physician specialty', async () => {
    const newPhysicianSpecialty = {
      physicianId: await getTestPhysicianId(),
      specialtiesId: await getTestSpecialtyId(),
    };
    const id = await waitForId(physicianSpecialtyId);
    const response = await request(app).get(`${baseEndpoint}/${id}`);
    const body = response.body;

    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining(newPhysicianSpecialty)
    );

    toDeleteCounter--;
  });

  test('Get the physician specialties', async () => {
    response = await request(app).get(baseEndpoint);
    expect(response.statusCode).toBe(200);
    response.body.msg.map(item => {
      expect(item).toEqual({
        id: expect.any(Number),
        physicianId: expect.any(Number),
        specialtiesId: expect.any(Number),
      })
    });

    toDeleteCounter--;
  });

  test('Delete the physician specialty', async () => {
    const id = await waitForId(physicianSpecialtyId, true, toDeleteCounter);
    const response = await request(app).delete(`${baseEndpoint}/${id}`);

    expect(response.statusCode).toBe(204);
  });
});


describe('Test addresses routes', () => {
  let addressId = undefined;
  let toDeleteCounter = 4;
  const baseEndpoint = "/api/addresses";

  test('Creating a new address', async () => {
    const newAddress = {
      physicianId: await getTestPhysicianId(),
      type: "apartament",
      zipcode: "12228-460",
      state: "SP",
      city: "São José dos Campos",
      district: "DCTA",
      street: "Rua H8A",
      number: "133",
    };
    const response = await request(app)
      .post(baseEndpoint)
      .send(newAddress);
    const body = response.body;

    expect(response.statusCode).toBe(201);
    expect(body.msg).toEqual(
      expect.objectContaining(newAddress)
    );

    addressId = body.msg.id ? body.msg.id : null;
    toDeleteCounter--;
  });

  test('Get the created address', async () => {
    const newAddress = {
      physicianId: await getTestPhysicianId(),
      type: "apartament",
      zipcode: "12228-460",
      state: "SP",
      city: "São José dos Campos",
      district: "DCTA",
      street: "Rua H8A",
      number: "133",
    };
    const id = await waitForId(addressId);
    const response = await request(app).get(`${baseEndpoint}/${id}`);
    const body = response.body;
    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining(newAddress)
    );

    toDeleteCounter--;
  });

  test('Get the addresses', async () => {
    response = await request(app).get(baseEndpoint);
    expect(response.statusCode).toBe(200);
    response.body.msg.map(item => {
      expect(item).toEqual({
        id: expect.any(Number),
        physicianId: expect.any(Number),
        type: expect.any(String),
        zipcode: expect.any(String),
        state: expect.any(String),
        city: expect.any(String),
        district: expect.any(String),
        street: expect.any(String),
        number: expect.any(String),
      })
    });

    toDeleteCounter--;
  });

  test('Update the address', async () => {
    const id = await waitForId(addressId);
    const newAddress = {
      physicianId: await getTestPhysicianId(),
      type: "apartament",
      zipcode: "12228-460",
      state: "SP",
      city: "São José dos Campos",
      district: "DCTA",
      street: "Rua H8A",
      number: "133",
    };
    const updates = {
      physicianId: await getTestPhysicianId(),
      type: "apartament",
      zipcode: "12228-461",
      state: "SP",
      city: "São José dos Campos",
      district: "DCTA",
      street: "Rua H8B",
      number: "203",
    };
    const response = await request(app)
      .put(`${baseEndpoint}/${id}`)
      .send(updates);
    const body = response.body;

    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining({ ...newAddress, ...updates })
    );

    toDeleteCounter--;
  });

  test('Delete the address', async () => {
    const id = await waitForId(addressId, true, toDeleteCounter);
    const response = await request(app).delete(`${baseEndpoint}/${id}`);

    expect(response.statusCode).toBe(204);
  });
});


describe('Test contact routes', () => {
  let addressId = undefined;
  let toDeleteCounter = 4;
  const baseEndpoint = "/api/contacts";

  test('Creating a new contact', async () => {
    const newContact = {
      physicianId: await getTestPhysicianId(),
      type: "test",
      contact: "test"
    };
    const response = await request(app)
      .post(baseEndpoint)
      .send(newContact);
    const body = response.body;

    expect(response.statusCode).toBe(201);
    expect(body.msg).toEqual(
      expect.objectContaining(newContact)
    );

    addressId = body.msg.id ? body.msg.id : null;
    toDeleteCounter--;
  });

  test('Get the created contact', async () => {
    const newContact = {
      physicianId: await getTestPhysicianId(),
      type: "test",
      contact: "test"
    };
    const id = await waitForId(addressId);
    const response = await request(app).get(`${baseEndpoint}/${id}`);
    const body = response.body;
    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining(newContact)
    );

    toDeleteCounter--;
  });

  test('Get the contacts', async () => {
    response = await request(app).get(baseEndpoint);
    expect(response.statusCode).toBe(200);
    response.body.msg.map(item => {
      expect(item).toEqual({
        id: expect.any(Number),
        physicianId: expect.any(Number),
        type: expect.any(String),
        contact: expect.any(String),
      })
    });

    toDeleteCounter--;
  });

  test('Update the contact', async () => {
    const id = await waitForId(addressId);
    const newContact = {
      physicianId: await getTestPhysicianId(),
      type: "test",
      contact: "test"
    };
    const updates = {
      physicianId: await getTestPhysicianId(),
      type: "test2",
      contact: "test2"
    };
    const response = await request(app)
      .put(`${baseEndpoint}/${id}`)
      .send(updates);
    const body = response.body;

    expect(response.statusCode).toBe(200);
    expect(body.msg).toEqual(
      expect.objectContaining({ ...newContact, ...updates })
    );

    toDeleteCounter--;
  });

  test('Delete the contact', async () => {
    const id = await waitForId(addressId, true, toDeleteCounter);
    const response = await request(app).delete(`${baseEndpoint}/${id}`);

    expect(response.statusCode).toBe(204);
  });
});


/**
 * @todo: add tests for profile routes
 */