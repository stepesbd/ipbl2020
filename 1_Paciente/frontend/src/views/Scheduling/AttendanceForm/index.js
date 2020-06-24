import React, { useState, useEffect } from "react";
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
import { UsePostApi } from "../../../services/apiService";

import "react-quill/dist/quill.snow.css";
import "../../../assets/quill.css";

function AttendanceForm(props) {
  const [name, setName] = useState("");
  const [id, setId] = useState();
  const [newAttendance, setNewAttendance] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const { register, handleSubmit, errors, setValue, setError } = useForm();
  const physicianId = 1;

  useEffect(() => {
    verifyItem();
  }, []);

  const verifyItem = () => {
    if (props.location.pasprops) {
      let dados = props.location.pasprops.item;
      setName(dados.patient.name);
      setId(dados.patient.per_id);
    } /* else {
      props.history.push({
        pathname: "/schedule"
      });
    }*/
  };

  const [loading, setloading] = React.useState(false);
  const onSubmit = data => {
    let obj = {
      cpf: data.cpf,
      senha: data.senha
    };
    let endPoint = "attendance";
    setloading(true);

    UsePostApi("P", endPoint, obj).then(result => {
      console.log(result);
      if (result.status !== 204 && result.status !== 200) {
        setsalert(
          <SweetAlert warning title={result.message} onConfirm={hideAlert} />
        );
        setloading(false);
        return false;
      }

      setloading(false);
      if (result.data) {
        props.history.push({
          pathname: "/step2",
          state: { item: result.data }
        });
      } else {
        setsalert(
          <SweetAlert
            warning
            title="Usuário ou senha não encontrado!"
            onConfirm={hideAlert}
          />
        );
      }
      return true;
    });
  };

  const handleNew = () => {
    let endPoint = "attendances";
    let data = {
      physicianId,
      patId: id,
      diagnosis,
      newAttendance
    };
    UsePostApi("D", endPoint, data).then(result => {
      console.log(data);
      console.log(result);
      props.history.push({
        pathname: "/schedule"
        //state: { item: data }
      });
    });
  };

  const handleBack = () => {
    props.history.push("/new-attendance");
  };

  const [salert, setsalert] = React.useState();
  const hideAlert = () => {
    setsalert(null);
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
                <Row>
                  <Container>
                    <label htmlFor="feFirstName">Paciente</label>

                    <FormInput
                      name="nome"
                      value={name}
                      placeholder="Nome"
                      disabled={true}
                    />
                    <br />

                    <label htmlFor="feFirstName">Sintomas</label>

                    <FormInput
                      name="nome"
                      value={name}
                      placeholder="Nome"
                      disabled={true}
                    />
                    <br />

                    <label htmlFor="estado">Estado</label>

                    <FormSelect id="estado">
                      <option>Selecione...</option>
                      <option>Leve</option>
                      <option>Médio</option>
                      <option>Grave</option>
                    </FormSelect>

                    <label htmlFor="diagnosis">Descrição*</label>
                    <FormTextarea
                      name="diagnosis"
                      value={diagnosis}
                      rows="10"
                      onChange={e => setDiagnosis(e.target.value)}
                    />
                    <br />
                  </Container>
                </Row>
                <br />
                <Row>
                  <Col>
                    <Button type="submit" onClick={handleNew} theme="accent">
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
