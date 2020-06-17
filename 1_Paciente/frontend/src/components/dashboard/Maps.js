import React from 'react';
import { Card, CardHeader, CardBody } from 'shards-react';

// import { Container } from './styles';

function dashboard() {
  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        <h6 className="m-0">Mapa</h6>
      </CardHeader>
      <CardBody className="d-flex py-0">
        <canvas height="220" className="blog-users-by-device m-auto" />
      </CardBody>
    </Card>
  );
}

export default dashboard;
