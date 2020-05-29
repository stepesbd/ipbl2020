import React, { Fragment, useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import moment from "moment";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Alert } from "shards-react";
import PageTitle from "../../../components/common/PageTitle";
import { UseGetApi, UseDeleteApi } from "../../../services/apiService";
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert from "react-bootstrap-sweetalert";

function PhysicianList() {
    const [loading, setloading] = useState(false);
    const [list, setlist] = useState([]);
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
        let endPoint = "physicians"
        UseGetApi('D',endPoint).then(result => {
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

    const removerRegistro = (id) => {

        let endPoint = "physicians/"
        UseDeleteApi('D',endPoint, id).then(result => {
            if (result.status !== 200) {
                setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
                setloading(false);
                return false;
            }
            console.log(result.data)

            var listFiltered = list.filter(obj => {
                return obj.perId !== id;
            });
            setlist(listFiltered);
            setloading(false);
            setsalert(<SweetAlert title="Deletado com sucesso!" onConfirm={hideAlert} />);
            return true;
        });
        setsalert(null);
    }
    const [salert, setsalert] = useState();
    const confirmDelete = (id) => {
        setsalert(<SweetAlert
            danger
            showCancel
            confirmBtnText="Sim"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Tem certeza que deseja remover o registro?"
            onConfirm={() => removerRegistro(id)}
            onCancel={hideAlert}
        >
            Essa ação não poderá ser desfeita!
        </SweetAlert>);
    }
    const hideAlert = () => {
        setsalert(null);
    }

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
                    <PageTitle sm="4" title="Médicos" subtitle="Lista de dados" className="text-sm-left" />
                </Row>

                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Médicos Cadastrados</h6>

                                <NavLink to="/physician-form">
                                    <Button style={{ right: '10px', top: '10px', position: 'absolute' }} type="submit" className="mb-4">Adicionar Médico</Button>
                                </NavLink>
                            </CardHeader>
                            <CardBody className="p-0 pb-3">

                                <table className="table mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th scope="col" className="border-0">
                                                #
                  </th>
                                            <th scope="col" className="border-0">
                                                Nome
                  </th>
                                            <th scope="col" className="border-0">
                                                CRM
                  </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.crm}</td>
                                                <td align="right">
                                                    <NavLink to={{
                                                        pathname: "/physician-form",
                                                        pasprops: { item: item }
                                                    }}>
                                                        <Button outline size="sm" theme="info" className="mb-2 mr-1">
                                                            <i className="material-icons">edit</i> Editar
                      </Button>
                                                    </NavLink>
                                                    <Button onClick={(e) => confirmDelete(item.id)} outline size="sm" theme="danger" className="mb-2 mr-1">
                                                        <i className="material-icons">delete</i> Remover
                      </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>


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

export default PhysicianList;