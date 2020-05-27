import React, { useEffect } from "react";
import moment from "moment";
import { useForm } from 'react-hook-form'
import PageTitle from "../../components/common/PageTitle";
import { NavLink } from "react-router-dom";
import {
  Container,
  Card,
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
import { UsePutApi,UsePostApi } from "../../services/apiService";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import { testModeAPI } from "react-ga";

export default function PatientForm (props){

  const { register, handleSubmit, errors, setValue,setError } = useForm();
  const [item,setitem] = React.useState({});
  
  useEffect(() => {
    verifyItem();    
  }, []);

  const verifyItem = () =>{
    if(props.location.pasprops)
    {
      let dados = props.location.pasprops.item;
      setitem(dados);
      setValue("nome",dados.perFirstName);
      setValue("sobrenome",dados.perLastName);
      if(dados.perBirth)
        setValue('datanasc', moment(item.perBirth).format('DD/MM/YYYY')); 
      setValue("email",dados.perEmail);
      setValue("cpf",dados.perCpf); 
    }
  }

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {
    
    if (data.datanasc!==""&&!moment(data.datanasc, 'DD/MM/YYYY',true).isValid()) {
      setError("datanasc", "invaliddate", "Data Inválida")
      return false;
    }

    setloading(true);
    let endPoint = "person/"
    let dtN = null;

    if(data.datanasc)
      dtN = moment(data.datanasc, 'DD/MM/YYYY').toDate()

    if(item.perId)
    {
      //Editar
      item.perFirstName = data.nome;
      item.perLastName = data.sobrenome;
      item.perEmail = data.email;
      item.perCpf = data.cpf;
      item.perBirth = dtN;
    

      console.log(item)
      UsePutApi(endPoint,item.perId,item).then(result => {
        if (result.status !== 200) {
          setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
          setloading(false);
          return false;
        }
        setloading(false);
        setsalert(<SweetAlert success title={result.message} onConfirm={hideAlert} />);
        return true;
      });
    }
    else
    {
      
      //Inserir
      let obj ={
        perId:0,
        perFirstName: data.nome,
        perLastName: data.sobrenome,
        perEmail: data.email,
        perCpf: data.cpf,
        perBirth: dtN
      }
      UsePostApi(endPoint,obj).then(result => {
        if (result.status !== 200) {
          setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
          setloading(false);
          return false;
        }
        setloading(false);
        setsalert(<SweetAlert success title={result.message} onConfirm={hideAlert} />);
        return true;
      });
    }
  }
  const [salert,setsalert] = React.useState();
  const hideAlert = () =>{
    setsalert(null);
  }

return (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="Cadastro de Paciente" subtitle="Cadastros" md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      
    {salert}

      <Col lg="12">
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Paciente</h6>
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
                        name="nome"
                        invalid={errors.nome}
                        placeholder="Nome"
                        innerRef={register({ required: true })}
                      />
                      {errors.nome && <span class="obg">Obrigátorio</span>}
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feLastName">Sobrenome*</label>
                      <FormInput
                        name="sobrenome"
                        invalid={errors.sobrenome}
                        placeholder="Sobrenome"
                        innerRef={register({ required: true })}
                      />
                      {errors.sobrenome && <span class="obg">Obrigátorio</span>}
                    </Col>
                  </Row>
                  <Row form>
                    <Col md="4" className="form-group">
                      <label htmlFor="feEmail">E-mail*</label>
                      <FormInput
                        name="email"
                        invalid={errors.email}
                        placeholder="email"
                        innerRef={register({ required: true })}
                      />
                      {errors.email && <span class="obg">Obrigátorio</span>}
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="fePassword">CPF</label>
                      <FormInput
                        name="cpf"
                        placeholder="cpf"
                        innerRef={register}
                      />
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="fePassword">Data Nascimento</label>
                      <FormInput
                        name="datanasc"
                        invalid={errors.datanasc}
                        placeholder="datanasc"
                        innerRef={register}
                      />
                    </Col>
                  </Row>
                   <FormGroup>
                    <label htmlFor="feAddress">Endereço</label>
                    <FormInput
                      id="feAddress"
                      placeholder="Address"
                      value="Rua Palmeira"
                      onChange={() => {}}
                    />
                  </FormGroup>
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="feCity">Cidade</label>
                      <FormInput
                        id="feCity"
                        placeholder="Cidade"
                        onChange={() => {}}
                      />
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputState">Estado</label>
                      <FormSelect id="feInputState">
                        <option>Selecione...</option>
                        <option>...</option>
                      </FormSelect>
                    </Col>
                    <Col md="2" className="form-group">
                      <label htmlFor="feZipCode">CEP</label>
                      <FormInput
                        id="feZipCode"
                        placeholder="CEP"
                        onChange={() => {}}
                      />
                    </Col>
                  </Row>
                  <br/>
                  <Button theme="accent">Salvar</Button>
                  <NavLink to="/patient-list">        
                    <Button theme="default" style={{marginLeft:'10px'}}>Voltar</Button>
                  </NavLink>
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
