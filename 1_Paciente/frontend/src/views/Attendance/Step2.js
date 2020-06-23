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
  FormCheckbox 
} from "shards-react";
import ClipLoader from "react-spinners/ClipLoader";
import PageTitle from "../../components/common/PageTitle";

const Step2 = (props) => 
{
  
  const { register, handleSubmit, errors, setValue,setError } = useForm();

  useEffect(() => {
    verifyProps();    
  }, []);

  const [nome,setnome] = React.useState('');
  const [paciente,setpaciente] = React.useState({});
  const verifyProps = () =>{
    if(props.location.state.item)
    {
      let dados = props.location.state.item; 
      setpaciente(dados.per);
      setnome(dados.per.perFirstName);
    }
  }

  const [sintomas,setsintomas] = React.useState({
    febre: false,
    fadiga: false,
    tosse: false,
    anorexia: false,
    dispneia: false,
    dorpressaopeito: false,
    perdafalamovimento: false,
    escarro: false,
    mialgias: false,
    dordegarganta: false,
    conjuntivite: false,
    diarreia: false,
    neuseas: false,
    cefaleia: false,
    perdapaladar:false,
    tontura: false,
    rinorreia: false,
  });

  const handleChange = (e, sintoma) =>{
    const newState = {};
    newState[sintoma] = !sintomas[sintoma];
    setsintomas({ ...sintomas, ...newState });
  }

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {    
    props.history.push({
      pathname: '/step3',
      state:{item:sintomas, pac:paciente}
    })
  };

  const handleVoltar = () =>{
    props.history.push('/step1')
  }

return (
  <Container fluid className="main-content-container px-4">
    <br/><br/>
    <Row>
      <Col lg="12">
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Sintomas</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row form>
                    <Col md="12" className="form-group">
                      <h5>Olá, {nome}!</h5> <label htmlFor="feFirstName">Informe seus sintomas: *</label>
                      <div>
                        <FormCheckbox
                          checked={sintomas.febre}
                          onChange={e => handleChange(e, "febre")}
                        >
                          Febre
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.fadiga}
                          onChange={e => handleChange(e, "fadiga")}
                        >
                          Fadiga (Cansaço)
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.tosse}
                          onChange={e => handleChange(e, "tosse")}
                        >
                          Tosse
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.anorexia}
                          onChange={e => handleChange(e, "anorexia")}
                        >
                          Anorexia
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.dispneia}
                          onChange={e => handleChange(e, "dispneia")}
                        >
                          Dispneia (falta de ar)
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.dorpressaopeito}
                          onChange={e => handleChange(e, "dorpressaopeito")}
                        >
                          Dor ou Pressão no peito
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.perdafalamovimento}
                          onChange={e => handleChange(e, "perdafalamovimento")}
                        >                         
                         Perda Fala ou Movimento
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.escarro}
                          onChange={e => handleChange(e, "escarro")}
                        > 
                         Escarro
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.mialgias}
                          onChange={e => handleChange(e, "mialgias")}
                        >
                          Mialgias
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.dordegarganta}
                          onChange={e => handleChange(e, "dordegarganta")}
                        >
                          Dor de garganta
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.conjuntivite}
                          onChange={e => handleChange(e, "conjuntivite")}
                        >
                          Conjuntivite
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.diarreia}
                          onChange={e => handleChange(e, "diarreia")}
                        >
                          Diarreia
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.neuseas}
                          onChange={e => handleChange(e, "neuseas")}
                        >
                          Náuseas
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.cefaleia}
                          onChange={e => handleChange(e, "cefaleia")}
                        >
                          Cefaleia (Dor de Cabeça)
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.alteracaocoloracao}
                          onChange={e => handleChange(e, "alteracaocoloracao")}
                        >
                          Alteração Coloração da Pele
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.perdapaladar}
                          onChange={e => handleChange(e, "perdapaladar")}
                        >
                          Perda Paladar ou Olfato
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.tontura}
                          onChange={e => handleChange(e, "tontura")}
                        >
                          Tontura
                        </FormCheckbox>
                        <FormCheckbox
                          checked={sintomas.rinorreia}
                          onChange={e => handleChange(e, "rinorreia")}
                        >
                          Rinorreia
                        </FormCheckbox>
                      </div>
                      {errors.nome && <span class="obg">Obrigátorio</span>}
                    </Col>
                  </Row>
                  
                  <br/> 
                    <Button type="submit" theme="accent"  style={{marginRight:'10px'}}>Enviar</Button>
                    <Button type="button" onClick={e => handleVoltar(e)}  theme="default">Voltar</Button> 
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

export default Step2;
