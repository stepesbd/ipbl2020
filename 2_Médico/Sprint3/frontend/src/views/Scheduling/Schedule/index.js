import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Container, Card, CardHeader, ListGroup, ListGroupItem, Row, Col, Button, ListGroupItemHeading, ListGroupItemText } from "shards-react";
import { UseGetApi } from "../../../services/apiService";

function Schedule(props) {
    const [patients, setPatients] = useState([])
    const [attendances, setAttendances] = useState([])

    useEffect(() => {
        loadPatients();
        loadAttendances();
    }, []);

    const loadPatients = () => {
        let endPoint = "patient"
        UseGetApi('P', endPoint).then(result => {
            if (result.status !== 200) {
                return false;
            }
            setPatients(result.data);
            return true;
        });
    };

    const loadAttendances = () => {
        let endPoint = "attendances"
        UseGetApi('D', endPoint).then(result => {
            if (result.status !== 200) {
                return false;
            }
            setAttendances(result.data);
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

    function getName(id) {
        let patient = patients.find(patient => patient.patId == id)
        if (patient !== undefined) {
            return patient.per.perFirstName + " " + patient.per.perLastName
        }
    }

    return (
        <Container fluid className="main-content-container px-4">

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
                                        {attendances.map(attendance => (
                                            <ListGroupItem key={attendance._id}>
                                                <ListGroupItemHeading>
                                                    <Link to="">
                                                        {
                                                            getName(attendance.patId)
                                                        }
                                                    </Link>
                                                </ListGroupItemHeading>
                                            </ListGroupItem>
                                        ))}
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


                    </Card>
                </Col>
            </Row>



        </Container >
    )
};

export default Schedule;
