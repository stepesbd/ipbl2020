# Sprint 1 - TS2_Médicos - Backend



---

## Testes

Framework utilizada:
- [JEST](https://jestjs.io)

Para executar os testes automatizados, basta utilizar o seguite comando:

```bash
yarn test
```

### Testes de unidade

#### Definição de unidade:
Será tomado como unidade toda função exportada ou método público que serão reutilizados (mais de uma vez) na codebase. Não serão testados métodos ou funções cujo motivo de sua criação seja apenas para dar legibilidade ao código (ex: quebrar uma função muito grande em funções menores).

#### Exemplo:

Para cada unidade de cada módulo, os testes devem ser codificados conforme o exemplo abaixo:

```js
// unit.js
module.exports.myUnit = () => "Hello world";
```

```js
// unit.test.js
const unit = require('./unit');

test('Unit test example', () => {
  expect(unit.myUnit()).toBe("Hello world");
});
```

Executando o teste:
```bash
yarn test
```
    yarn run v1.22.4
    $ jest
    PASS  src/examples/unit.test.js
      ✓ Unit test example (2ms)

    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        1.594s
    Ran all test suites.
    Done in 2.86s.


#### Referências:
- https://jestjs.io/docs/en/getting-started.html


### Testes de integração

O módulo `app.js` reúne a integração de todo backend, portanto, os testes de integração se encontram codificados em `app.test.js`.

Antes de executar os testes de integração, certifique-se de que a há um servidor local de MySQL disponível. Para cada rota do backend, o teste pode ser codificado conforme o exemplo:

```js
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
```

#### Referências:
- https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest
- https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6

---
