import React, { useState, useEffect } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import PageTitle from "../../../components/common/PageTitle";
import { NavLink } from "react-router-dom";
import {
  Container,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormInput,
  Button,
  FormSelect
} from "shards-react";
import {
  UsePutApi,
  UsePostApi,
  UseGetApiCEP
} from "../../../services/apiService";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";

export default function PhysicianForm(props) {
  const { register, handleSubmit, errors, setValue, setError } = useForm();
  const [item, setitem] = React.useState({});

  useEffect(() => {
    verifyItem();
  }, []);

  const verifyItem = () => {
    if (props.location.pasprops) {
      let dados = props.location.pasprops.item;
      setitem(dados);
      setValue("nome", dados.per.perFirstName);
    }
  };

  const [loading, setloading] = useState(false);
  const onSubmit = data => {
    setloading(true);
    let endPoint = "physicians/";
    let dtN = null;

    if (item.Id) {
      //Editar
      item.per.perFirstName = data.nome;
      item.per.perLastName = data.sobrenome;
      item.per.perEmail = data.email;
      item.per.perSenha = data.senha;
      item.per.perCpf = data.cpf;
      item.per.perBirth = dtN;
      item.per.add.addStreet = data.rua;
      item.per.add.addNumber = data.numero;
      item.per.add.addCity = data.cidade;
      item.per.add.addState = data.estado;
      item.per.add.addNeighborhood = data.bairro;
      item.per.add.addCountry = data.pais;
      item.per.add.addZipcode = data.cep;
      item.per.add.addLatitude = data.lat;
      item.per.add.addLongitude = data.long;

      console.log(item);
      UsePutApi("D", endPoint, item.Id, item).then(result => {
        if (result.status !== 200) {
          setsalert(
            <SweetAlert warning title={result.message} onConfirm={hideAlert} />
          );
          setloading(false);
          return false;
        }
        setloading(false);
        setsalert(
          <SweetAlert success title={result.message} onConfirm={hideAlert} />
        );
        return true;
      });
    } else {
      //Inserir
      let obj = {
        name: data.name,
        crm: data.crm,
        cpf: data.cpf,
        address: {
          type: data.type,
          zipcode: data.cep,
          state: data.estado,
          city: data.cidade,
          district: data.bairro,
          street: data.rua,
          number: data.numero
        },
        contact: {
          type: "local",
          contact: data.contato
        }
      };

      UsePostApi("D", endPoint, obj).then(result => {
        console.log(result.data);
        if (result.status !== 200) {
          setsalert(
            <SweetAlert warning title={result.message} onConfirm={hideAlert} />
          );
          setloading(false);
          return false;
        }
        setloading(false);
        setsalert(
          <SweetAlert success title={result.message} onConfirm={hideAlert} />
        );
        return true;
      });
    }
  };
  const [salert, setsalert] = React.useState();
  const hideAlert = () => {
    setsalert(null);
  };

  const handleCepChange = e => {
    let value = e;
    value = value.replace("-", "");

    setloading(true);
    UseGetApiCEP(value).then(result => {
      if (result.status !== 200) {
        setsalert(
          <SweetAlert warning title={result.message} onConfirm={hideAlert} />
        );
        clearEndereco();
        setloading(false);
        return false;
      }
      //console.log(result.data);
      if (result.data.logradouro) {
        setValue("rua", result.data.logradouro);
        setValue("bairro", result.data.bairro);
        setValue("cidade", result.data.cidade.nome);
        setValue("estado", result.data.estado.sigla);
        setValue("lat", result.data.latitude);
        setValue("long", result.data.longitude);
        setValue("numero", "");
        setValue("pais", "");
      } else {
        clearEndereco();
      }
      setloading(false);
      return true;
    });
  };

  const clearEndereco = () => {
    setValue("rua", "");
    setValue("bairro", "");
    setValue("cidade", "");
    setValue("estado", "");
    setValue("lat", "");
    setValue("long", "");
    setValue("numero", "");
    setValue("pais", "");
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Cadastro de Médico"
          subtitle="Cadastros"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        {salert}

        <Col lg="12">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Médico</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Row form>
                        {/* First Name */}
                        <Col md="6" className="form-group">
                          <label htmlFor="name">Nome*</label>
                          <FormInput
                            name="name"
                            invalid={errors.name}
                            placeholder="Nome"
                            innerRef={register({ required: true })}
                          />
                          {errors.name && <span class="obg">Obrigátorio</span>}
                        </Col>
                        {/* CPF */}
                        <Col md="3" className="form-group">
                          <label htmlFor="feLastName">CPF*</label>
                          <FormInput
                            name="cpf"
                            invalid={errors.cpf}
                            placeholder="CPF"
                            innerRef={register({ required: true })}
                          />
                          {errors.cpf && <span class="obg">Obrigátorio</span>}
                        </Col>
                        {/* CRM */}
                        <Col md="3" className="form-group">
                          <label htmlFor="feLastName">CRM*</label>
                          <FormInput
                            name="crm"
                            invalid={errors.crm}
                            placeholder="CRM"
                            innerRef={register({ required: true })}
                          />
                          {errors.crm && <span class="obg">Obrigátorio</span>}
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="3" className="form-group">
                          <label htmlFor="feEmail">Tipo*</label>
                          <FormSelect
                            id="type"
                            name="type"
                            invalid={errors.type}
                            innerRef={register({ required: true })}
                          >
                            <option value="">Selecione...</option>
                            <option value="local">Local</option>
                            <option value="comercial">Comercial</option>
                            <option value="outros">Outros</option>
                          </FormSelect>
                          {errors.type && <span class="obg">Obrigátorio</span>}
                        </Col>
                        <Col md="3" className="form-group">
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
                            style={{ display: "none" }}
                          />
                          <FormInput
                            name="long"
                            innerRef={register()}
                            style={{ display: "none" }}
                          />
                          {errors.cep && <span class="obg">Obrigátorio</span>}
                        </Col>

                        <Col md="3" className="form-group">
                          <label htmlFor="feInputState">Estado</label>
                          <FormSelect
                            id="estado"
                            name="estado"
                            invalid={errors.estado}
                            innerRef={register({ required: true })}
                          >
                            <option value="">Selecione...</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                          </FormSelect>
                          {errors.estado && (
                            <span class="obg">Obrigátorio</span>
                          )}
                        </Col>
                        <Col md="3" className="form-group">
                          <label htmlFor="feCity">Cidade</label>
                          <FormInput
                            name="cidade"
                            invalid={errors.cidade}
                            innerRef={register({ required: true })}
                          />
                          {errors.cidade && (
                            <span class="obg">Obrigátorio</span>
                          )}
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="5" className="form-group">
                          <label htmlFor="feCity">Bairro</label>
                          <FormInput
                            name="bairro"
                            invalid={errors.bairro}
                            innerRef={register({ required: true })}
                          />
                          {errors.bairro && (
                            <span class="obg">Obrigátorio</span>
                          )}
                        </Col>

                        <Col md="5" className="form-group">
                          <label htmlFor="feAddress">Rua</label>
                          <FormInput
                            name="rua"
                            invalid={errors.rua}
                            innerRef={register({ required: true })}
                          />
                          {errors.rua && <span class="obg">Obrigátorio</span>}
                        </Col>

                        <Col md="2" className="form-group">
                          <label htmlFor="feAddress">Nº</label>
                          <FormInput
                            name="numero"
                            invalid={errors.numero}
                            innerRef={register({ required: true })}
                          />
                          {errors.numero && (
                            <span class="obg">Obrigátorio</span>
                          )}
                        </Col>
                      </Row>
                      <Row form></Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputState">Contato</label>
                          <FormInput name="contato" innerRef={register()} />
                        </Col>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputState">1º Especialidade</label>
                          <FormInput
                            name="pais"
                            invalid={errors.pais}
                            innerRef={register({ required: true })}
                          />
                          {errors.pais && <span class="obg">Obrigátorio</span>}
                        </Col>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputState">2º Especialidade</label>
                          <FormInput
                            name="outro"
                            invalid={errors.outro}
                            innerRef={register()}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Button theme="accent">Salvar</Button>
                      <NavLink to="/patient-list">
                        <Button theme="default" style={{ marginLeft: "10px" }}>
                          Voltar
                        </Button>
                      </NavLink>
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
}
