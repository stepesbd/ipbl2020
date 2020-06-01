import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Container, FormInput, FormTextarea, Card, CardHeader, ListGroup, ListGroupItem, Row, Col, Button, ListGroupItemHeading, ListGroupItemText } from "shards-react";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import { UsePostApi } from "../../../services/apiService";

function AttendanceForm(props) {
    const [name, setName] = useState('')
    const [id, setId] = useState()
    const { register, handleSubmit, errors, setValue, setError } = useForm();

    useEffect(() => {
        verifyItem();
    }, []);

    const verifyItem = () => {
        if (props.location.pasprops) {
            let dados = props.location.pasprops.item;
            setName(dados.per.perFirstName);
            setId(dados.patId)
        }
    }

    const [loading, setloading] = React.useState(false);
    const onSubmit = data => {

        let obj = {
            cpf: data.cpf,
            senha: data.senha
        };
        let endPoint = 'attendance';
        setloading(true);

        UsePostApi('P', endPoint, obj).then(result => {
            console.log(result)
            if (result.status !== 204 && result.status !== 200) {
                setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
                setloading(false);
                return false;
            }


            setloading(false);
            if (result.data) {
                props.history.push({
                    pathname: '/step2',
                    state: { item: result.data }
                })
            }
            else {
                setsalert(<SweetAlert warning title="Usuário ou senha não encontrado!" onConfirm={hideAlert} />);
            }
            return true;
        });

    };

    const handleNew = () => {
        props.history.push('/new-attendance')
    }

    const handleBack = () => {
        props.history.push('/new-attendance')
    }

    const [salert, setsalert] = React.useState();
    const hideAlert = () => {
        setsalert(null);
    }

    return (
        <Container fluid className="main-content-container px-4">

            {salert}
            <br /><br />

            <Row>
                <Col lg="12">
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">Atendimento</h6>
                        </CardHeader>
                        <ListGroup flush>
                            <ListGroupItem className="p-3">
                                <Row>
                                    <Container>
                                        <label htmlFor="feFirstName">Paciente*</label>
                                        <FormInput
                                            name="nome"
                                            value={name}
                                            placeholder="Nome"
                                            disabled={true}
                                        />
                                        <br />

                                        <label htmlFor="diagnosis">Descrição*</label>
                                        <FormTextarea name="diagnosis" />
                                        <br />
                                        <label htmlFor="newAttendance">Novo Agendamento*</label>
                                        <FormInput
                                            name="newAttendance"
                                            invalid={errors.nome}
                                            type="date"
                                        />
                                    </Container>

                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <Button type="submit" onClick={handleNew} theme="accent">Salvar</Button>
                                        <Button type="button" onClick={handleBack} theme="default" style={{ float: 'right' }}>Voltar</Button>
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



        </Container >
    )
};

export default AttendanceForm;
