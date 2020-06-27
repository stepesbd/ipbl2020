import React, { useState, useEffect, createRef } from 'react';
import { Card, CardHeader, CardBody } from 'shards-react';
import { UseGetApiURL } from '../../services/apiService';
import Chart from '../../utils/chart';

function infectedPatients(props) {
  const canvasRef = createRef();

  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{props.title}</h6>
      </CardHeader>
      <CardBody className="d-flex py-0">
        <canvas
          height="220"
          ref={canvasRef}
          className="blog-users-by-device m-auto"
        />
      </CardBody>
    </Card>
  );
}

export default infectedPatients;
