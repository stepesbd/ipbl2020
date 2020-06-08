import React, { useEffect } from "react";
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
import { UseGetApi } from "../../services/apiService";
import SweetAlert from "react-bootstrap-sweetalert";

const Step3 = (props) => 
{
  
  const { register, handleSubmit, errors, setValue,setError } = useForm();

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {
  
    //props.history.push('/')
  };

  const handleVoltar = () =>{
    props.history.push('/step1')
  }
  
  useEffect(() => {
    verifyProps();   
    loadMedicos(); 
  }, []);

  const [sintomas,setsintomas] = React.useState('');
  const verifyProps = () =>{
    if(props.location.state.item)
    {
      let s = [];
      s = props.location.state.item; 
      setsintomas(s);
      console.log(s);

      if(!s)
        return;
      if(s.length ===0)
        return;

      if(s.febre || s.dispneia || s.dorpressaopeito || s.perdafalamovimento || s.perdapaladar)
        setshowMedicos(true);
      else
        setshowMedicos(false);
  
    }
  }

  const [showMedicos,setshowMedicos] = React.useState(false);
  const [loadingD,setloadingD] = React.useState(false);
  const [listDoctors,setlistDoctors] = React.useState([]);
  const loadMedicos = () => {
    setloadingD(true);
    let endPoint = "physicians"
    UseGetApi('D',endPoint).then(result => {
      if (result.status !== 200) {
        setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
        setloadingD(false);
        return false;
      }
      setloadingD(false);
      setlistDoctors(result.data.msg);
      console.log(result.data.msg)
      return true;
    });
  };

  const [salert,setsalert] = React.useState();
  const hideAlert = () =>{
    setsalert(null);
  }

return (
  <Container fluid className="main-content-container px-4">
  <br/><br/>

    {/* Default Light Table */}
    <Row>
    {salert}
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

                    <Col md="12" className="form-group">
                      {!showMedicos && 
                      <div>
                        <h3>Que bom!</h3>
                        <label htmlFor="feFirstName">Você não precisa de atendimento no momento, continue se cuidando e <i>#fiqueemcasa</i> .</label>
                        <br/> <br/>
                        <center>
                        <Badge outline theme="warning">
                        VERIFIQUE REGULARMENTE!
                        </Badge></center>
                      </div>}
                      {showMedicos && 
                      <div>
                        <h3>Atenção!</h3>
                        <label htmlFor="feFirstName">Você precisa de atendimento no momento.</label>
                        <br/><br/>
                        <center>
                        <Badge outline theme="danger">
                         Escolha um médico para seu atendimento.
                        </Badge></center>

                        <br/>
                        <br/>
                        {listDoctors.length > 0 &&
                          <div style={{
                            background:'rgb(239, 239, 239)',
                            padding:'10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px'}}>
                          { 
                            listDoctors.map(item => (
                            <div key={item.id}>   
                            <b>Médico:</b> {item.name} - <b>CRM:</b> {item.crm}
                            </div>
                            ))
                          }
                          </div>
                        }

                      </div>}
                    </Col>
                  </Row>
                  
            {loadingD && <div className="loading">
              <ClipLoader
                size={60}
                color={"#123abc"}
                loading={loading}
              />
            </div>}

                  
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
