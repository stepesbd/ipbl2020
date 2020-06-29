import React, { Fragment, useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Alert,
} from 'shards-react';
import { UseGetApi } from '../../../services/apiService';
import ClipLoader from 'react-spinners/ClipLoader';
import PageTitle from '../../../components/common/PageTitle';

function SpecialtyList() {
  const [loading, setloading] = useState(false);
  const [list, setlist] = useState([]);
  const [salert, setsalert] = useState();
  const [notification, setnotification] = useState({
    show: false,
    message: '',
    color: 'info',
  });

  const hangleNotification = (s, m, c) => {
    setnotification({ show: s, message: m, color: c });
  };

  useEffect(() => {
    loadList();
  }, []);

  const loadList = () => {
    setloading(true);
    let endPoint = 'specialties';
    UseGetApi('D', endPoint).then((result) => {
      if (result.status !== 200) {
        hangleNotification(true, result.message, 'danger');
        setloading(false);
        return false;
      }
      setloading(false);
      setlist(result.data.msg);
      return true;
    });
  };

  return (
    <Fragment>
      <Container fluid className="main-content-container px-4">
        {notification.show && (
          <Container fluid className="px-0">
            <Alert className="mb-0" theme={notification.color}>
              <i className="fa mx-2 fa-info"></i>
              {notification.message}
            </Alert>
          </Container>
        )}

        {salert}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Especialidades"
            subtitle="Lista de dados"
            className="text-sm-left"
          />
        </Row>

        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Lista de Especialidades</h6>

                <NavLink to="/specialties-form">
                  <Button
                    style={{ right: '10px', top: '10px', position: 'absolute' }}
                    type="submit"
                    className="mb-4"
                  >
                    Adicionar Especialidade
                  </Button>
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
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index}</td>
                        <td>{item.name}</td>
                        <td>{item.status === 1 ? 'Ativo' : 'Desativado'}</td>

                        <td style={{ textAlign: 'right' }}>
                          <NavLink
                            to={{
                              pathname: '/specialties-form',
                              pasprops: { item: item },
                            }}
                          >
                            <Button
                              outline
                              size="sm"
                              theme="info"
                              className="mb-2 mr-1"
                            >
                              <i className="material-icons">edit</i> Editar
                            </Button>
                          </NavLink>
                          <Button
                            //onClick={(e) => confirmDelete(item.patId)}
                            outline
                            size="sm"
                            theme="danger"
                            className="mb-2 mr-1"
                          >
                            <i className="material-icons">delete</i> Remover
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {loading && (
                  <div className="loading">
                    <ClipLoader size={60} color={'#123abc'} loading={loading} />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default SpecialtyList;
