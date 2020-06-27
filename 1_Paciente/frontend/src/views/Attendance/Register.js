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
import { UsePutApi, UsePostApi, UseGetApiCEP } from "../../services/apiService";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";

export default function Register (props){

  const { register, handleSubmit, errors, setValue,setError } = useForm();
  const [item,setitem] = React.useState({});

  const [loading,setloading] = React.useState(false);
  const onSubmit = data => {
    
    if (data.datanasc!==""&&!moment(data.datanasc, 'DD/MM/YYYY',true).isValid()) {
      setError("datanasc", "invaliddate", "Data Inválida")
      return false;
    }
   
    setloading(true);
    let endPoint = "patient/"
    let dtN = null;

    if(data.datanasc)
      dtN = moment(data.datanasc, 'DD/MM/YYYY').toDate()

      
      let endPointChaves = "https://stepesbdmedrecords.herokuapp.com/api/keypair"
      UseGetApiURL(endPointComplete).then(result => {
        if (result.status !== 200) {
          setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
          setloadingK(false);
          return false;
        }else{
          console.log(result.data)
        }
      }); 

    //Inserir
    let obj = {
      patInclusionDate: new Date(),
      patStatus:1,
      per:
        {
          perFirstName: data.nome,
          perLastName: data.sobrenome,
          perEmail: data.email,
          perSenha: data.senha,
          perCpf: data.cpf,
          perBirth: dtN,
          add:
            {
              addStreet:data.rua,
              addNumber:data.numero,
              addCity:data.cidade,
              addState:data.estado,
              addNeighborhood:data.bairro,
              addCountry:data.pais,
              addZipcode:data.cep,
              addLatitude:data.lat,
              addLongitude:data.long
            }
        }
      };
    UsePostApi('P',endPoint,obj).then(result => {
      console.log(result)
      if (result.status !== 201) {
        setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
        setloading(false);
        return false;
      }
      setloading(false);
      setsalert(<SweetAlert success title={result.message} onConfirm={() => sendToStep2(result.data)} />);
      return true;
    });
    
  }

  const sendToStep2 = (data) =>{
    //console.log(data)
    props.history.push({
      pathname: '/step2',
      state:{item:data}
    })
  }

  const [salert,setsalert] = React.useState();
  const hideAlert = () =>{
    setsalert(null);
  }

  const handleCepChange = (e) =>{
    let value = e;
    value = value.replace("-","");

    setloading(true);
    UseGetApiCEP(value).then(result => {
      if (result.status !== 200) {
        setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);             
        clearEndereco();
        setloading(false);
        return false;
      }
      //console.log(result.data);  
      if(result.data.logradouro)  
      {  
        setValue("rua",result.data.logradouro); 
        setValue("bairro",result.data.bairro); 
        setValue("cidade",result.data.cidade.nome); 
        setValue("estado",result.data.estado.sigla); 
        setValue("lat",result.data.latitude);  
        setValue("long",result.data.longitude); 
        setValue("numero","");  
        setValue("pais",""); 
      }
      else
      {
        clearEndereco();
      }
      setloading(false);
      return true;
    });
  }
  
  const clearEndereco = () =>{
    setValue("rua","");
    setValue("bairro","");
    setValue("cidade",""); 
    setValue("estado",""); 
    setValue("lat","");  
    setValue("long","");
    setValue("numero","");  
    setValue("pais","");
  }

return (
  <Container fluid className="main-content-container px-4">
   
    <br/>
    <br/>
    <Row>
    {salert}

      <Col lg="12">
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Registre-se</h6>
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
                    <Col md="6" className="form-group">
                      <label htmlFor="feEmail">E-mail*</label>
                      <FormInput
                        name="email"
                        invalid={errors.email}
                        placeholder="email"
                        innerRef={register({ required: true })}
                      />
                      {errors.email && <span class="obg">Obrigátorio</span>}
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePassword">Data Nascimento*</label>
                      <FormInput
                        name="datanasc"
                        invalid={errors.datanasc}
                        placeholder="datanasc"
                        innerRef={register({ required: true })}
                      />
                      {errors.datanasc && <span class="obg">Obrigátorio</span>}
                    </Col>
                  </Row>
                  <Row form>                    
                  <Col md="6" className="form-group">
                      <label htmlFor="fePassword">CPF*</label>
                      <FormInput
                        name="cpf"
                        invalid={errors.cpf}
                        placeholder="cpf"
                        innerRef={register({ required: true })}
                      />
                      {errors.cpf && <span class="obg">Obrigátorio</span>}
                    </Col>
                    
                    <Col md="6" className="form-group">
                      <label htmlFor="feEmail">Senha*</label>
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
                  <Row form>
                    <Col md="12" className="form-group">
                      <label htmlFor="feZipCode">CEP</label>
                      <FormInput
                      name="cep"
                      invalid={errors.cep}
                      innerRef={register({ required: true })}               
                      onBlur={e => handleCepChange(e.target.value)}
                      />
                      <FormInput
                      name="lat"
                      innerRef={register()}                    
                      style={{display:'none'}}                     
                      />
                      <FormInput
                      name="long"
                      innerRef={register()}                      
                      style={{display:'none'}}
                      />
                    {errors.cep && <span class="obg">Obrigátorio</span>}
                    </Col>
                    <Col md="8" className="form-group">
                      <label htmlFor="feAddress">Endereço</label>
                      <FormInput
                        name="rua"
                        invalid={errors.rua}
                        innerRef={register({ required: true })}
                      />
                      {errors.rua && <span class="obg">Obrigátorio</span>}
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="feAddress">Nº</label>
                      <FormInput
                        name="numero"
                        invalid={errors.numero}
                        innerRef={register({ required: true })}
                      />
                      {errors.numero && <span class="obg">Obrigátorio</span>}
                    </Col>
                  </Row>
                  <Row form>                    
                    <Col md="6" className="form-group">
                        <label htmlFor="feCity">Bairro</label>
                        <FormInput
                        name="bairro"
                        invalid={errors.bairro}
                        innerRef={register({ required: true })}
                      />
                      {errors.bairro && <span class="obg">Obrigátorio</span>}
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="feCity">Cidade</label>
                      <FormInput
                      name="cidade"
                      invalid={errors.cidade}
                      innerRef={register({ required: true })}
                    />
                    {errors.cidade && <span class="obg">Obrigátorio</span>}
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="feInputState">Estado</label>
                      <FormInput
                      name="estado"
                      invalid={errors.estado}
                      innerRef={register({ required: true })}
                    />
                    {errors.estado && <span class="obg">Obrigátorio</span>}
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="feInputState">Pais</label>
                      <FormInput
                      name="pais"
                      invalid={errors.pais}
                      innerRef={register({ required: true })}
                    />
                    {errors.pais && <span class="obg">Obrigátorio</span>}
                    </Col>
                  </Row>
                  <br/>
                  <Button theme="accent">Salvar</Button>
                  <NavLink to="/step1">        
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
