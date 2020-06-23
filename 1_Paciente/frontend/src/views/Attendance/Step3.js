import React, { useEffect } from "react";
import moment from "moment";
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
  Badge, 
  FormRadio,
  FormInput
} from "shards-react";
import ClipLoader from "react-spinners/ClipLoader";
import PageTitle from "../../components/common/PageTitle";
import { UseGetApi,UseGetApiURL, UsePostApi } from "../../services/apiService";
import SweetAlert from "react-bootstrap-sweetalert";

const Step3 = (props) => 
{
  
  const { register, handleSubmit, errors, setValue,setError } = useForm();

  const handleVoltar = () =>{
    props.history.push('/step1')
  }
  
  useEffect(() => {
    verifyProps();   
    loadMedicos(); 

  }, []);

  const [paciente,setpaciente] = React.useState({});
  const [sintomas,setsintomas] = React.useState('');
  const [showAgendamento,setshowAgendamento] = React.useState(false);
  const verifyProps = () =>{
    if(props.location.state.item)
    {
  

      let s = [];
      s = props.location.state.item; 
      setsintomas(s);
      setpaciente(props.location.state.pac);
      //console.log(props.location.state.pac);

      loadHospitals(props.location.state.pac);

      if(!s)
        return;
      if(s.length ===0)
        return;

      if(s.febre || s.dispneia || s.dorpressaopeito || s.perdafalamovimento || s.perdapaladar)
      setshowAgendamento(true);
      else
      setshowAgendamento(false);
  
    }
  }

  const [loadingD,setloadingD] = React.useState(false);
  const [listDoctors,setlistDoctors] = React.useState([]);
  const loadMedicos = () => {
    setloadingD(true);
    let endPointComplete = "https://stepesbdapi.herokuapp.com/api/rand"
    UseGetApiURL(endPointComplete).then(result => {
      if (result.status !== 200) {
        setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
        setloadingD(false);
        return false;
      }
      setloadingD(false);
      setlistDoctors(result.data);
      return true;
    });
  };

  const [loadingH,setloadingH] = React.useState(false);
  const [listHospitals,setlistHospitals] = React.useState([]);
  const loadHospitals =(p) => {
    
    setloadingH(true);
    let endPointComplete = "https://cors-anywhere.herokuapp.com/https://stepesbdhospital.herokuapp.com/api/hosp-list"
    UseGetApiURL(endPointComplete).then(result => {
      if (result.status !== 200) {
        setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
        setloadingH(false);
        return false;
      }
      setloadingH(false);
      getNearestHospitals(result.data,p);
      /*if(result.data.length > 5)
      {
        var top5Hospitals = result.data.slice(1, 5);
        setlistHospitals(top5Hospitals);
      }
      else
      {
        setlistHospitals(result.data);
      }*/

      return true;
    });
  };

  const getNearestHospitals =(hospitais,pacient)=>{
    
    let hospDist = []
    hospitais.map(element => {
      let resultDist = distanceTo(pacient.add.addLatitude,pacient.add.addLongitude,element.add_latitude,element.add_longitude);
      let newh = {...element,distancia:resultDist};
      hospDist.push(newh);
    });

  hospDist.sort(function compare(a, b) {
    if (a.distancia < b.distancia) return -1;
    if (a.distancia > b.distancia) return 1;
    return 0;
    
  })

    var top5Hospitals = hospDist.slice(1, 5);
    setlistHospitals(top5Hospitals);
    console.log(top5Hospitals);
  }

  const [doctorSelected,setdoctorSelected] = React.useState(0);
  const handleChangeDoctor = (e, doctor) =>{
    setdoctorSelected(doctor);
  }

  const [hospitalSelected,sethospitalSelected] = React.useState(0);
  const handleChangeHospital = (e, hospital) =>{
    sethospitalSelected(hospital);
  }

  const [salert,setsalert] = React.useState();
  const hideAlert = () =>{
    setsalert(null);
  }


  function distanceTo(lat1, lon1, lat2, lon2) {
    var rlat1 = Math.PI * lat1/180
    var rlat2 = Math.PI * lat2/180
    var rlon1 = Math.PI * lon1/180
    var rlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var rtheta = Math.PI * theta/180
    var dist = Math.sin(rlat1) * Math.sin(rlat2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.cos(rtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return Math.round(dist, 2);
  }

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {
      
      if (data.dataatendimento!==""&&!moment(data.dataatendimento, 'DD/MM/YYYY',true).isValid()) {
        setError("dataatendimento", "invaliddate", "Data Inválida")
        return false;
      }
  
      setloading(true);
      let endPoint = "attendance/"
      let dtA = null;
  
      if(data.dataatendimento)
        dtA = moment(data.dataatendimento, 'DD/MM/YYYY').toDate()
      
      let sint = "";
      if(sintomas.febre)
        sint = "febre,";
      if(sintomas.fadiga)
        sint = sint+ "fadiga,";
      if(sintomas.tosse)
        sint = sint+ "tosse,";
      if(sintomas.anorexia)
        sint = sint+ "anorexia,";
      if(sintomas.dispneia)
        sint = sint+ "dispneia,";
      if(sintomas.dorpressaopeito)
        sint = sint+ "dorpressaopeito,";
      if(sintomas.perdafalamovimento)
        sint = sint+ "perdafalamovimento,";
      if(sintomas.mialgias)
        sint = sint+ "mialgias,";
      if(sintomas.dordegarganta)
        sint = sint+ "dordegarganta,";
      if(sintomas.conjuntivite)
        sint = sint+ "conjuntivite,";
      if(sintomas.diarreia)
        sint = sint+ "diarreia,";
      if(sintomas.neuseas)
        sint = sint+ "neuseas,";
      if(sintomas.cefaleia)
        sint = sint+ "cefaleia,";
      if(sintomas.perdapaladar)
        sint = sint+ "perdapaladar,";        
      if(sintomas.tontura)
        sint = sint+ "tontura,";
      if(sintomas.rinorreia)
        sint = sint+ "rinorreia,";     
  

      //Inserir
      let obj = {
        attDate: dtA,
        attPreSymptoms: sint,
        attDescription: data.obs,
        hosId: hospitalSelected,
        medId: doctorSelected,
        perId: paciente.perId
      }

      UsePostApi('P',endPoint,obj).then(result => {
        console.log(result)
        if (result.status !== 201) {
          setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
          setloading(false);
          return false;
        }
        setloading(false);
        setsalert(<SweetAlert success title="Agendamento Realizado com Sucesso!" onConfirm={() => sendToStep1()} />);
        return true;
      });
      
    }

    const sendToStep1 = () =>{
      props.history.push({
        pathname: '/step1'
      })
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
                      {!showAgendamento && 
                      <div>
                        <h3>Que bom!</h3>
                        <label htmlFor="feFirstName">Você não precisa de atendimento no momento, continue se cuidando e <i>#fiqueemcasa</i> .</label>
                        <br/> <br/>
                        <center>
                        <Badge outline theme="warning">
                        VERIFIQUE REGULARMENTE!
                        </Badge></center>
                      </div>}
                      {showAgendamento && 
                      <div>
                        <h3>Atenção!</h3>
                        <label htmlFor="feFirstName">Você precisa de atendimento no momento.</label>
                        <br/>
                        <center>
                        <Badge outline theme="danger">
                         Faça um agendamento para seu atendimento:
                        </Badge></center>
                        
                        <h6>Hospitais:</h6>

                        <center><Badge outline theme="success">
                          Selecionamos os hospitais mais proximos do seu endereço.
                        </Badge></center>
                        <br/>

                        {listHospitals.length > 0 &&
                          <div style={{
                            background:'rgb(239, 239, 239)',
                            padding:'10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px'}}>
                          { 
                            listHospitals.map(item => (
                            <div key={item.hos_id}>   
                            
                              <FormRadio
                                name="hospital"
                                checked={hospitalSelected === item.hos_id}
                                onChange={e => handleChangeHospital(e, item.hos_id)}
                              >
                              <b>Hospital:</b> {item.hos_name} ({item.distancia} Km)
                              </FormRadio>
                            </div>
                            ))
                          }
                          </div>
                        }
                        
                        <br/>
                        <h6>Médicos:</h6>
                        {listDoctors.length > 0 &&
                          <div style={{
                            background:'rgb(239, 239, 239)',
                            padding:'10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px'}}>
                          { 
                            listDoctors.map(item => (
                            <div key={item.id}>   
                            
                              <FormRadio
                                name="doctor"
                                checked={doctorSelected === item.id}
                                onChange={e => handleChangeDoctor(e, item.id)}
                              >
                              <b>Médico:</b> {item.name} - <b>CRM:</b> {item.crm}
                              </FormRadio>
                            </div>
                            ))
                          }
                          </div>
                        }
                        <br/>
                        
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="fePassword">Data Atendimento*</label>
                            <FormInput
                              name="dataatendimento"
                              invalid={errors.dataatendimento}
                              placeholder="dd/MM/yyyy"
                              innerRef={register({ required: true })}
                            />
                            {errors.dataatendimento && <span class="obg">Obrigátorio</span>}
                          </Col>
                        </Row>
                        <Row form>                    
                        <Col md="12" className="form-group">
                            <label htmlFor="fePassword">OBS</label>
                            <FormInput
                              name="obs"
                              invalid={errors.obs}
                              placeholder="obs"
                              innerRef={register()}
                            />
                            {errors.obs && <span class="obg">Obrigátorio</span>}
                          </Col>
                        </Row>
                        <br/>
                        <Button theme="accent">Realizar Agendamento</Button>

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
