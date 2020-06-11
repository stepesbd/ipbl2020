import React, { Fragment, useState, useEffect } from 'react';
import moment from "moment";
import { useForm } from 'react-hook-form'
import PageTitle from "../../../components/common/PageTitle";
import {
    Container,
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
} from "shards-react";
import { UsePutApi, UsePostApi } from "../../../services/apiService";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";


function PhysicianForm(props) {
    const { register, handleSubmit, errors, setValue, setError } = useForm();
    const [item, setitem] = useState({});

    useEffect(() => {
        verifyItem();
    }, []);

    const verifyItem = () => {
        if (props.location.pasprops) {
            let dados = props.location.pasprops.item;
            setitem(dados);
            setValue("nome", dados.perFirstName);
            setValue("sobrenome", dados.perLastName);
            if (dados.perBirth)
                setValue('datanasc', moment(item.perBirth).format('DD/MM/YYYY'));
            setValue("email", dados.perEmail);
            setValue("cpf", dados.perCpf);
        }
    }

    const [loading, setloading] = useState(false);
    const onSubmit = data => {

        if (data.datanasc !== "" && !moment(data.datanasc, 'DD/MM/YYYY', true).isValid()) {
            setError("datanasc", "invaliddate", "Data Inválida")
            return false;
        }

        setloading(true);
        let endPoint = "physicians/"
        let dtN = null;

        if (data.datanasc)
            dtN = moment(data.datanasc, 'DD/MM/YYYY').toDate()

        if (item.perId) {
            //Editar
            item.perFirstName = data.nome;
            item.perLastName = data.sobrenome;
            item.perEmail = data.email;
            item.perCpf = data.cpf;
            item.perBirth = dtN;

            console.log(item)
            UsePutApi(endPoint, item.perId, item).then(result => {
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
        else {

            //Inserir
            let obj = {
                perId: 0,
                perFirstName: data.nome,
                perLastName: data.sobrenome,
                perEmail: data.email,
                perCpf: data.cpf,
                perBirth: dtN
            }
            UsePostApi(endPoint, obj).then(result => {
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
    const [salert, setsalert] = React.useState();
    const hideAlert = () => {
        setsalert(null);
    }


    return (
        <Fragment>
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title="Cadastro de Médico" subtitle="Cadastros" md="12" className="ml-sm-auto mr-sm-auto" />
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
        </Fragment>
    )
}

export default PhysicianForm;