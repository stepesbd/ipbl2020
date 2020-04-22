require('dotenv/config');
const request = require('supertest');
const app = require('./app');

const physician = {
  name: "João",
  crm: "123485",
  cpf: "45103412302",
}

async function waitForId(pendingId, isToDelete, toDeleteCounter) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if(pendingId && (!isToDelete || toDeleteCounter === 0)) {
        resolve(pendingId);
        clearInterval(interval);
      } else if (pendingId === null) {
        reject(new Error("Missing id"));
      }
    }, 100);
  });
}

async function createTestPhysician() {

}

async function deleteTestPhysician() {

}

beforeAll(async () => {
  await createTestPhysician();
});

afterAll(async () => {
  await deleteTestPhysician();
});

describe('Test Physicians', () => {
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
      expect.objectContaining({...newPhysician, ...updates})
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
      expect.objectContaining({...newSpecialty, ...updates})
    );

    toDeleteCounter--;
  });

  test('Delete the specialty', async () => {
    const id = await waitForId(specialtyId, true, toDeleteCounter);
    const response = await request(app).delete(`${baseEndpoint}/${id}`);
    
    expect(response.statusCode).toBe(204);
  });
});