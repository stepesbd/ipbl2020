import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import PageTitle from '../../../components/common/PageTitle';
import { NavLink } from 'react-router-dom';
import {
  Container,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormInput,
  Button,
} from 'shards-react';
import { UsePutApi, UsePostApi } from '../../../services/apiService';
import ClipLoader from 'react-spinners/ClipLoader';
import SweetAlert from 'react-bootstrap-sweetalert';

export default function PatientForm(props) {
  const { register, handleSubmit, errors, setValue, setError } = useForm();
  const [item, setitem] = useState({});

  useEffect(() => {
    verifyItem();
  }, []);

  const verifyItem = () => {
    if (props.location.pasprops) {
      let dados = props.location.pasprops.item;
      setitem(dados);
      setValue('name', dados.name);
    }
  };

  const [loading, setloading] = useState(false);
  const onSubmit = (data) => {
    setloading(true);
    let endPoint = 'specialties/';

    if (item.id) {
      //Editar
      item.name = data.name;

      console.log(item);
      UsePutApi('D', endPoint, item.id, item).then((result) => {
        if (result.status !== 200) {
          setsalert(
            <SweetAlert warning title={result.message} onConfirm={hideAlert} />
          );
          setloading(false);
          return false;
        }
        setloading(false);
        setsalert(
          <SweetAlert success title={result.message} onConfirm={hideAlert} />
        );
        return true;
      });
    } else {
      //Inserir
      let obj = {
        name: data.name,
      };

      UsePostApi('D', endPoint, obj).then((result) => {
        if (result.status !== 200) {
          setsalert(
            <SweetAlert warning title={result.message} onConfirm={hideAlert} />
          );
          setloading(false);
          return false;
        }
        setloading(false);
        setsalert(
          <SweetAlert success title={result.message} onConfirm={hideAlert} />
        );
        return true;
      });
    }
  };
  const [salert, setsalert] = React.useState();
  const hideAlert = () => {
    setsalert(null);
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Cadastro de Especialidades"
          subtitle="Cadastros"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        {salert}

        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Especialidades</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Row form>
                        {/* First Name */}
                        <Col md="6" className="form-group">
                          <label htmlFor="feFirstName">Nome*</label>
                          <FormInput
                            name="name"
                            invalid={errors.name}
                            placeholder="Nome"
                            innerRef={register({ required: true })}
                          />
                          {errors.name && <span class="obg">Obrigátorio</span>}
                        </Col>
                      </Row>

                      <br />
                      <Button theme="accent">Salvar</Button>
                      <NavLink to="/patient-list">
                        <Button theme="default" style={{ marginLeft: '10px' }}>
                          Voltar
                        </Button>
                      </NavLink>
                    </form>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>

            {loading && (
              <div className="loading">
                <ClipLoader size={60} color={'#123abc'} loading={loading} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
