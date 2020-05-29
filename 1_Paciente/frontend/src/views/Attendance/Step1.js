import React from "react";
import { useForm } from 'react-hook-form'
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
import { UsePostApi } from "../../services/apiService";

const Step1 = (props) => 
{
  
  const { register, handleSubmit, errors, setValue,setError } = useForm();

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {

    let obj = {
      cpf: data.cpf,
      senha: data.senha
    };
    let endPoint = 'attendance';
    setloading(true);

    UsePostApi('P',endPoint,obj).then(result => {
      console.log(result)
      if (result.status !== 204 && result.status !== 200) {
        setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
        setloading(false);
        return false;
      }


      setloading(false);
      if(result.data)
      { 
        props.history.push({
          pathname: '/step2',
          state:{item:result.data}
        })
      }
      else
      {
        setsalert(<SweetAlert warning title="Usuário ou senha não encontrado!" onConfirm={hideAlert} />); 
      }
      return true;
    });
    
  };

  const hangleRegister = () =>{
    props.history.push('/register')
  }

  const [salert,setsalert] = React.useState();
  const hideAlert = () =>{
    setsalert(null);
  }

return (
  <Container fluid className="main-content-container px-4">
    
    {salert}
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
                  
                   <Button type="submit" theme="accent">Enviar</Button>     
                   <Button type="button" theme="default"  onClick={e => hangleRegister(e)} style={{float:'right'}}>Registre-se</Button>
                   
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
