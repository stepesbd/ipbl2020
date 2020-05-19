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
  Button,
  Badge 
} from "shards-react";
import ClipLoader from "react-spinners/ClipLoader";
import PageTitle from "../../components/common/PageTitle";

const Step3 = (props) => 
{
  
  const { register, handleSubmit, errors, setValue,setError } = useForm();

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {
  
    props.history.push('/patient-list')
  };

  const handleVoltar = () =>{
    props.history.push('/step1')
  }

return (
  <Container fluid className="main-content-container px-4">
  <br/><br/>

    {/* Default Light Table */}
    <Row>
      <Col lg="12">
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Resultado</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row form>
                    {/* First Name */}
                    <Col md="12" className="form-group">
                      
                      <h3>Parabéns!</h3>
                      <label htmlFor="feFirstName">Você não precisa de atendimento no momento.</label>
                      <br/>
                      
                      <Badge outline theme="warning">
                      VERIFIQUE REGULARMENTE!
                      </Badge>
                      
                    </Col>
                  </Row>
                  
                  <br/> 
                    <Button type="button" onClick={e => handleVoltar(e)}  theme="default">Reiniciar</Button> 
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

    <br/><br/><br/><br/>

  </Container>
)};

export default Step3;
