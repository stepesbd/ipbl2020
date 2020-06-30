import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormInput,
  Button
} from "shards-react";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import PageTitle from "../../components/common/PageTitle";
import { UseGetApiParams } from "../../services/apiService";

const Login = props => {
  const { register, handleSubmit, errors, setValue, setError } = useForm();

  useEffect(() => {
    const physician = sessionStorage.getItem("physician");
    if (physician) {
      props.history.push({
        pathname: "/schedule"
      });
    }
  }, []);

  const [loading, setloading] = React.useState(false);
  const onSubmit = data => {
    let obj = {
      crm: data.crm.toUpperCase()
    };
    let endPoint = "login";
    setloading(true);

    UseGetApiParams("D", endPoint, obj).then(result => {
      if (result.status !== 204 && result.status !== 200) {
        setsalert(
          <SweetAlert warning title={result.message} onConfirm={hideAlert} />
        );
        setloading(false);
        return false;
      }

      setloading(false);
      if (result.data && data.password === "medico") {
        sessionStorage.setItem("physician", JSON.stringify(result.data.msg));
        props.history.push({
          pathname: "/schedule"
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

  const hangleRegister = () => {
    props.history.push("/dashboard");
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
      {/* Default Light Table */}
      <Row>
        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Login</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Row form>
                        {/* First Name */}
                        <Col md="12" className="form-group">
                          <label htmlFor="feFirstName">CRM*</label>
                          <FormInput
                            name="crm"
                            invalid={errors.crm}
                            innerRef={register({ required: true })}
                          />
                          {errors.crm && <span class="obg">ObrigÃ¡torio</span>}
                        </Col>
                        <Col md="12" className="form-group">
                          <label htmlFor="feFirstName">Senha</label>
                          <FormInput
                            name="password"
                            type="password"
                            invalid={errors.password}
                            innerRef={register({ required: true })}
                          />
                          {errors.password && (
                            <span class="obg">ObrigÃ¡torio</span>
                          )}
                        </Col>
                        {/* Last Name */}
                      </Row>

                      <br />

                      <Button
                        type="submit"
                        theme="accent"
                        style={{ float: "center" }}
                      >
                        Entrar
                      </Button>
                      <Button
                        type="button"
                        theme="default"
                        onClick={e => hangleRegister(e)}
                        style={{ float: "right" }}
                      >
                        Voltar
                      </Button>
                    </form>
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
};

export default Login;
