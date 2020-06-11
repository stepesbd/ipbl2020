import React from 'react';
import {
  Container,
  Col,
  Row,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  FormInput,
  Button,
} from 'shards-react';

export default function Login() {
  return (
    <Container fluid className="main-content-container px-4">
      <Row>
        <Col lg="12">
          <Card small className="mb-4 ">
            <CardHeader>
              <h6 className="m-0">Login</h6>
            </CardHeader>

            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <form>
                      <Row form>
                        {/* First Name */}
                        <Col md="12" className="form-group">
                          <label htmlFor="feFirstName">CPF*</label>
                          <FormInput name="cpf" />
                        </Col>
                        {/* Last Name */}
                        <Col md="12" className="form-group">
                          <label htmlFor="feLastName">Senha*</label>
                          <FormInput
                            name="senha"
                            placeholder="senha"
                            type="password"
                          />
                        </Col>
                      </Row>

                      <br />

                      <Button type="submit" theme="accent">
                        Enviar
                      </Button>
                      <Button type="button" theme="default">
                        Voltar
                      </Button>
                    </form>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
