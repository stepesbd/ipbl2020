import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import { NavLink } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";

const PatientList = () => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Pacientes" subtitle="Lista de dados" className="text-sm-left" />
    </Row>

    {/* Default Light Table */}
    <Row>
      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Pacientes Cadastrados</h6>   
            
          <NavLink to="/patient-form">        
            <Button style={{right:'10px',top:'10px',position:'absolute'}} type="submit" className="mb-4">Adicionar Paciente</Button>
           </NavLink> 
          </CardHeader>
          <CardBody className="p-0 pb-3">

            <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                    #
                  </th>
                  <th scope="col" className="border-0">
                   Nome
                  </th>
                  <th scope="col" className="border-0">
                    Sobrenome
                  </th>
                  <th scope="col" className="border-0">
                    Cidade
                  </th>
                  <th scope="col" className="border-0">
                    Estado
                  </th>
                  <th scope="col" className="border-0">
                    Celular
                  </th>
                  <th scope="col" className="border-0">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>João</td>
                  <td>Silva</td>
                  <td>São José dos Campos</td>
                  <td>SP</td>
                  <td>(12) 9892-0339</td>
                  <td>
                  <Button outline size="sm" theme="info" className="mb-2 mr-1">                    
                    <i className="material-icons">edit</i> Editar
                  </Button>
                  <Button outline size="sm" theme="danger" className="mb-2 mr-1">                 
                    <i className="material-icons">delete</i> Remover
                  </Button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Bruna</td>
                  <td>Angela</td>
                  <td>São José dos Campos</td>
                  <td>SP</td>
                  <td>(12) 9892-0339</td>
                  <td>
                  <Button outline size="sm" theme="info" className="mb-2 mr-1">                    
                    <i className="material-icons">edit</i> Editar
                  </Button>
                  <Button outline size="sm" theme="danger" className="mb-2 mr-1">                 
                    <i className="material-icons">delete</i> Remover
                  </Button>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Carlos</td>
                  <td>Nathan</td>
                  <td>Jacareí</td>
                  <td>SP</td>
                  <td>(12) 9892-0339</td>
                  <td>
                  <Button outline size="sm" theme="info" className="mb-2 mr-1">                    
                    <i className="material-icons">edit</i> Editar
                  </Button>
                  <Button outline size="sm" theme="danger" className="mb-2 mr-1">                 
                    <i className="material-icons">delete</i> Remover
                  </Button>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Ana Clara</td>
                  <td>Santos</td>
                  <td>Jacareí</td>
                  <td>SP</td>
                  <td>(12) 9892-0339</td>
                  <td>
                  <Button outline size="sm" theme="info" className="mb-2 mr-1">                    
                    <i className="material-icons">edit</i> Editar
                  </Button>
                  <Button outline size="sm" theme="danger" className="mb-2 mr-1">                 
                    <i className="material-icons">delete</i> Remover
                  </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col>
    </Row>

  </Container>
);

export default PatientList;
