import React, { Fragment, useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Alert } from "shards-react";
import { UseGetApi, UseDeleteApi } from "../../../services/apiService";
import ClipLoader from "react-spinners/ClipLoader";
import PageTitle from "../../../components/common/PageTitle";
import SpecialtyCard from '../../../components/Utils/SpecialtyCard';


function SpecialtyList() {
    const [loading, setloading] = useState(false);
    const [list, setlist] = useState([]);
    const [salert, setsalert] = useState();
    const [notification, setnotification] = useState({
        show: false,
        message: '',
        color: 'info'
    });

    const hangleNotification = (s, m, c) => {
        setnotification({ show: s, message: m, color: c });
    };

    useEffect(() => {
        loadList();
    }, []);

    const loadList = () => {
        setloading(true);
        let endPoint = "specialties"
        UseGetApi(endPoint).then(result => {
            if (result.status !== 200) {
                hangleNotification(true, result.message, 'danger')
                setloading(false);
                return false;
            }
            console.log(result.data.msg)
            setloading(false);
            setlist(result.data.msg);
            return true;
        });
    };

    return (
        <Fragment>
            <Container fluid className="main-content-container px-4">
                {notification.show &&
                    <Container fluid className="px-0">
                        <Alert className="mb-0" theme={notification.color}>
                            <i className="fa mx-2 fa-info" ></i>
                            {notification.message}
                        </Alert>
                    </Container>}

                {salert}
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Especialidades" subtitle="Lista de dados" className="text-sm-left" />
                </Row>

                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Especialidades</h6>

                                <NavLink to="/physician-form">
                                    <Button style={{ right: '10px', top: '10px', position: 'absolute' }} type="submit" className="mb-4">Adicionar Especialidade</Button>
                                </NavLink>
                            </CardHeader>
                            <CardBody className="p-0 pb-3">

                                {list.map(item => (
                                    <SpecialtyCard
                                        specialty={item}
                                    />
                                ))}

                                {loading && <div className="loading">
                                    <ClipLoader
                                        size={60}
                                        color={"#123abc"}
                                        loading={loading}
                                    />
                                </div>}

                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </Fragment>
    )
}

export default SpecialtyList;