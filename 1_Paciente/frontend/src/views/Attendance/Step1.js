import React from "react";
import { useForm } from 'react-hook-form'
import {
  Container,
  Card,
  CardBody,
  NavLink,
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
import ClipLoader from "react-spinners/ClipLoader";
import PageTitle from "../../components/common/PageTitle";

const Step1 = (props) => 
{
  
  const { register, handleSubmit, errors, setValue,setError } = useForm();

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {
    props.history.push('/step2')
  };

  const handleVoltar = () =>{
    props.history.push('/register')
  }

return (
  <Container fluid className="main-content-container px-4">
    <br/><br/>
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
                      <label htmlFor="feFirstName">CPF*</label>
                      <FormInput
                        name="cpf"
                        invalid={errors.cpf}
                        placeholder="000.000.000-00"
                        innerRef={register({ required: true })}
                      />
                      {errors.cpf && <span class="obg">Obrigátorio</span>}
                    </Col>
                    {/* Last Name */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feLastName">Senha*</label>
                      <FormInput
                        name="senha"
                        invalid={errors.senha}
                        placeholder="senha"
                        type="password"
                        innerRef={register({ required: true })}
                      />
                      {errors.senha && <span class="obg">Obrigátorio</span>}
                    </Col>
                  </Row>
                  
                  <br/>  
                    <Button type="submit" theme="accent">Enviar (Sintomas)</Button>
                    <Button type="button" onClick={e => handleVoltar(e)}  theme="default">Enviar (Cadastro)</Button> 
                  </form> 
            
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>

            {loading && <div className="loading">
              <ClipLoader
                size={60}
                color={"#123abc"}
                loading={loading}
              />
            </div>}

      </Card>
      </Col>
    </Row>

    

  </Container>
)};

export default Step1;
