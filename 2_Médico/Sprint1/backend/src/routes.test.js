const request = require('supertest');
const app = require('./app');

describe('Test the root path', () => {
  test('It must response the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('The response JSON msg must be "Hello World !"', async () => {
    const body = (await request(app).get('/')).body;
    expect(body.msg).toBe("Hello World !");
  });
});
