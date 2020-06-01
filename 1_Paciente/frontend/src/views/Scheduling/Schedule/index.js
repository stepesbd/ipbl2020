import React from "react";
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {
    Container,
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Button,
    ListGroupItemHeading,
    ListGroupItemText
} from "shards-react";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import PageTitle from "../../../components/common/PageTitle";
import { UsePostApi } from "../../../services/apiService";

function Schedule(props) {

    const { register, handleSubmit, errors, setValue, setError } = useForm();

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
        props.history.push('/patient-list')
    }

    const [salert, setsalert] = React.useState();
    const hideAlert = () => {
        setsalert(null);
    }

    return (
        <Container fluid className="main-content-container px-4">

            {salert}
            <br /><br />
            {/* Default Light Table */}
            <Row>
                <Col lg="12">
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">Atendimentos</h6>
                        </CardHeader>
                        <ListGroup flush>
                            <ListGroupItem className="p-3">
                                <Row>
                                    <ListGroup>
                                        <ListGroupItem>
                                            <ListGroupItemHeading>
                                                <Link to="">
                                                    Luan Henrique Souza Dantas
                                                </Link>
                                            </ListGroupItemHeading>
                                            <ListGroupItemText>Data: 01/06/2020</ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <ListGroupItemHeading>
                                                <Link to="">
                                                    João Das Neves
                                                </Link>
                                            </ListGroupItemHeading>
                                            <ListGroupItemText>Data: 01/06/2020</ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <ListGroupItemHeading>
                                                <Link to="">
                                                    João Mário
                                                </Link>
                                            </ListGroupItemHeading>
                                            <ListGroupItemText>Data: 01/06/2020</ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <ListGroupItemHeading>
                                                <Link to="">
                                                    João Silva
                                                </Link>
                                            </ListGroupItemHeading>
                                            <ListGroupItemText>Data: 01/06/2020</ListGroupItemText>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button type="submit" onClick={handleNew} theme="accent">Novo Atendimento</Button>
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

export default Schedule;
