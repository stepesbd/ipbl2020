import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
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
import PageTitle from '../../../components/common/PageTitle';
import ClipLoader from 'react-spinners/ClipLoader';
import { NavLink } from 'react-router-dom';
import { UseGetApi } from '../../../services/apiService';

function Schedule(props) {
  const [loading, setloading] = useState(false);
  const [list, setlist] = useState([]);
  const [notification, setnotification] = React.useState({
    show: false,
    message: '',
    color: 'info',
  });

  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = () => {
    let endPoint = 'attendances';
    UseGetApi('D', endPoint).then((result) => {
      if (result.status !== 200) {
        return false;
      }
      setAttendances(result.data.msg);
      return true;
    });
  };

  const handleNew = () => {
    props.history.push('/new-attendance');
  };

  const handleBack = () => {
    props.history.push('/patient-list');
  };

  const [salert, setsalert] = React.useState();
  const hideAlert = () => {
    setsalert(null);
  };

  return (
    <Container fluid className="main-content-container px-12">
      {notification.show && (
        <Container fluid className="px-0">
          <Alert className="mb-0" theme={notification.color}>
            <i className="fa mx-2 fa-info"></i>
            {notification.message}
          </Alert>
        </Container>
      )}

      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Agenda Médica"
          subtitle="Lista de Atendimentos"
          className="text-sm-left"
        />
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Atendimentos em Aberto</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      #
                    </th>
                    <th
                      style={{ width: '500px' }}
                      scope="col"
                      className="border-0"
                    >
                      Paciente
                    </th>
                    <th
                      style={{ textAlign: 'center' }}
                      scope="col"
                      className="border-0"
                    >
                      DT nascimento
                    </th>
                    <th
                      style={{ textAlign: 'center' }}
                      scope="col"
                      className="border-0"
                    >
                      CPF
                    </th>
                    <th
                      style={{ textAlign: 'center' }}
                      scope="col"
                      className="border-0"
                    >
                      Agendamento
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((item, index) => (
                    <tr key={item.att_id}>
                      <td>{index}</td>
                      <td>{item.patient.name}</td>
                      <td style={{ textAlign: 'center' }}>
                        {moment.utc(item.per_birth).format('DD/MM/YYYY')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.patient.per_cpf}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {moment.utc(item.att_date).format('DD/MM/YYYY HH:mm')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <NavLink
                          to={{
                            pathname: '/attendance-form',
                            pasprops: { item: item },
                          }}
                        >
                          <Button
                            outline
                            size="sm"
                            theme="success"
                            className="mb-2 mr-1"
                          >
                            <i className="material-icons">local_hospital</i>{' '}
                            ATENDER
                          </Button>
                        </NavLink>
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
  );
}

export default Schedule;
