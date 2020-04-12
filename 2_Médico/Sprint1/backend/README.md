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

O módulo `routes.js` reúne a integração de todo backend, portanto, os testes de integração se encontram codificados em `routes.test.js`.

Antes de executar os testes de integração, certifique-se de que o servidor está sendo executado em background.

```bash
yarn start
```
    yarn run v1.22.4
    $ nodemon src
    [nodemon] 2.0.2
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching dir(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node src`
    Running server on port 3001


Para cada rota do backend, o teste pode ser codificado conforme o exemplo:

```js
const request = require('supertest');
const app = require('./app');

//...

describe('Test the root path', () => {
  test('It must response the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('The response JSON msg must be "Hello World !"', async () => {
    const body = (await request(app).get('/')).body;
    expect(body.msg).toBe("Hello World !");
  });

  //...
});
```

#### Referências:
- https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest

---
