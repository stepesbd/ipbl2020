import React from "react";
import PageTitle from "../../components/common/PageTitle";
import {
  Container,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button
} from "shards-react";

const PatientForm = () => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="Cadastro de Paciente" subtitle="Cadastros" md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      <Col lg="12">
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Paciente</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row form>
                    {/* First Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">Nome</label>
                      <FormInput
                        id="feFirstName"
                        placeholder="First Name"
                        value="Nome do usuário"
                        onChange={() => {}}
                      />
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feLastName">Sobrenome</label>
                      <FormInput
                        id="feLastName"
                        placeholder="Last Name"
                        value="Sobrenome do usuário"
                        onChange={() => {}}
                      />
                    </Col>
                  </Row>
                  <Row form>
                    {/* Email */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feEmail">E-mail</label>
                      <FormInput
                        type="email"
                        id="feEmail"
                        placeholder="Email Address"
                        value="email@example.com"
                        onChange={() => {}}
                        autoComplete="email"
                      />
                    </Col>
                    {/* Password */}
                    <Col md="6" className="form-group">
                      <label htmlFor="fePassword">Senha</label>
                      <FormInput
                        type="password"
                        id="fePassword"
                        placeholder="Password"
                        value="EX@MPL#P@$$w0RD"
                        onChange={() => {}}
                        autoComplete="current-password"
                      />
                    </Col>
                  </Row>
                  <FormGroup>
                    <label htmlFor="feAddress">Endereço</label>
                    <FormInput
                      id="feAddress"
                      placeholder="Address"
                      value="Rua Palmeira"
                      onChange={() => {}}
                    />
                  </FormGroup>
                  <Row form>
                    {/* City */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feCity">Cidade</label>
                      <FormInput
                        id="feCity"
                        placeholder="Cidade"
                        onChange={() => {}}
                      />
                    </Col>
                    {/* State */}
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputState">Estado</label>
                      <FormSelect id="feInputState">
                        <option>Selecione...</option>
                        <option>...</option>
                      </FormSelect>
                    </Col>
                    {/* Zip Code */}
                    <Col md="2" className="form-group">
                      <label htmlFor="feZipCode">CEP</label>
                      <FormInput
                        id="feZipCode"
                        placeholder="CEP"
                        onChange={() => {}}
                      />
                    </Col>
                  </Row>
                  <Row form>
                    {/* Description */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feDescription">Descrição</label>
                      <FormTextarea id="feDescription" rows="5" />
                    </Col>
                  </Row>
                  <Button theme="accent">Salvar</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
      </Col>
    </Row>
  </Container>
);

export default PatientForm;
