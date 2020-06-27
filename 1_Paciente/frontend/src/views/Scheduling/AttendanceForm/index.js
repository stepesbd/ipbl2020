import React, { useState, useEffect } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import {
  Container,
  FormInput,
  FormTextarea,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button,
  FormSelect
} from "shards-react";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import { UsePostApiURL } from "../../../services/apiService";

import "react-quill/dist/quill.snow.css";
import "../../../assets/quill.css";

function AttendanceForm(props) {
  const { register, handleSubmit, errors, setValue, setError } = useForm();
  const [item, setItem] = useState({});

  useEffect(() => {
    verifyItem();
  }, []);

  const verifyItem = () => {
    if (props.location.pasprops) {
      const dados = props.location.pasprops.item;
      setItem(dados);
      console.log(dados);
      setValue("patientName", dados.patient.name);
      setValue("sintomas", dados.att_pre_symptoms);
      setValue("description", dados.att_description);
    } else {
      props.history.push({
        pathname: "/schedule"
      });
    }
  };

  const [loading, setloading] = React.useState(false);

  const handleBack = () => {
    props.history.push("/schedule");
  };

  const [salert, setsalert] = React.useState();
  const hideAlert = () => {
    setsalert(null);
  };

  function setData(data) {
    console.log(item);
    const symptons = item.att_pre_symptoms.split(",").map(elem => {
      if (elem.length !== 0) {
        return elem.toLowerCase();
      }
    });
    return {
      Comentarios: data.description,
      Estado: data.estado,
      Sintomas: symptons,
      Data_atendimento: item.att_date,
      Hospital: {
        Id: item.hos_id
      },
      Medico: {
        CRM: "",
        Nome: "",
        PrivateKey: "",
        PubicKey: ""
      },
      Paciente: {
        CPF: "",
        Endereco: {
          Bairro: "",
          CEP: "",
          Cidade: "",
          Latitude: "",
          Longitude: "",
          Numero: "",
          Rua: "",
          UF: ""
        },
        FatorRH: "",
        GrupoSanguineo: "",
        Id: 0,
        Nascimento: "",
        Nome: "",
        PrivateKey: "",
        PublicKey: ""
      }
    };
  }

  const SubmitHandler = data => {
    setloading(true);
    const endPoint = "https://stepesbdmedrecords.herokuapp.com";
    const attendanceData = setData(data);
    setloading(false);
    setsalert(<SweetAlert success title={"teste"} onConfirm={hideAlert} />);
    return true;
  };

  return (
    <Container fluid className="main-content-container px-4">
      {salert}
      <br />
      <br />

      <Row>
        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Atendimento</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <form onSubmit={handleSubmit(SubmitHandler)}>
                  <Row>
                    <Container>
                      <label htmlFor="feFirstName">Paciente</label>

                      <FormInput
                        name="patientName"
                        //value={name}
                        placeholder="Nome"
                        innerRef={register({ required: true })}
                        disabled={true}
                      />
                      <br />

                      <label htmlFor="feFirstName">Sintomas</label>

                      <FormInput
                        name="sintomas"
                        //value={name}
                        placeholder="Nome"
                        innerRef={register({ required: true })}
                        disabled={true}
                      />
                      <br />

                      <label htmlFor="estado">Estado</label>

                      <FormSelect
                        id="estado"
                        name="estado"
                        invalid={errors.estado}
                        innerRef={register({ required: true })}
                      >
                        <option value="">Selecione...</option>
                        <option value="Leve">Leve</option>
                        <option value="Médio">Médio</option>
                        <option value="Grave">Grave</option>
                      </FormSelect>
                      {errors.estado && <span class="obg">Obrigátorio</span>}
                      <br />
                      <label htmlFor="diagnosis">Descrição*</label>
                      <FormTextarea
                        name="description"
                        //value={diagnosis}
                        invalid={errors.description}
                        innerRef={register({ required: true })}
                        rows="10"
                        //onChange={e => setDiagnosis(e.target.value)}
                      />
                      {errors.description && (
                        <span class="obg">Obrigátorio</span>
                      )}
                      <br />
                    </Container>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Button
                        type="submit"
                        /*onClick={handleNew}*/ theme="accent"
                      >
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleBack}
                        theme="default"
                        style={{ float: "right" }}
                      >
                        Voltar
                      </Button>
                    </Col>
                  </Row>
                </form>
              </ListGroupItem>
            </ListGroup>
            {loading && (
              <div className="loading">
                <ClipLoader size={60} color={"#123abc"} loading={loading} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AttendanceForm;
