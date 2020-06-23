import React, { useState, useEffect, createRef } from 'react';
import { Card, CardHeader, CardBody } from 'shards-react';
import { UseGetApiURL } from '../../services/apiService';
import Chart from '../../utils/chart';

// import { Container } from './styles';

function infectedPatients(props) {
  const canvasRef = createRef();
  const [total, setTotal] = useState(0);
  const [contaminados, setContaminados] = useState(0);
  const [recuperados, setRecuperados] = useState(0);
  const [obitos, setObitos] = useState(0);

  useEffect(() => {
    totalHandler();
    recuperadosHandler();
    obitosHandler();
    contaminadosHandler();
    renderGraph();
  }, []);

  function totalHandler() {
    let endPointComplete =
      'https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/positive/amount';
    UseGetApiURL(endPointComplete).then((response) => {
      setTotal(response.data);
    });
  }

  function obitosHandler() {
    let endPointComplete =
      'https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/death/amount';
    UseGetApiURL(endPointComplete).then((response) => {
      setObitos(response.data);
    });
  }

  function recuperadosHandler() {
    let endPointComplete =
      'https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/release/amount';
    UseGetApiURL(endPointComplete).then((response) => {
      setRecuperados(response.data);
    });
  }

  function contaminadosHandler() {
    setContaminados(total);
  }

  function renderGraph() {
    const chartConfig = {
      type: 'pie',
      data: {
        datasets: [
          {
            hoverBorderColor: '#ffffff',
            data: [total, recuperados, obitos],
            backgroundColor: [
              'rgb(255,180,0)',
              'rgb(23,198,113)',
              'rgb(255,65,105)',
            ],
          },
        ],
        labels: ['Contaminados', 'Recuperados', 'Ã“bitos'],
      },
      options: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 25,
            boxWidth: 20,
          },
        },
        cutoutPercentage: 0,
        tooltips: {
          custom: false,
          mode: 'index',
          position: 'nearest',
        },
      },
    };

    new Chart(canvasRef.current, chartConfig);
  }

  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{props.title}</h6>
      </CardHeader>
      <CardBody className="d-flex py-0">
        <p>Total: {total}</p>
        <p>Recuperados: {recuperados}</p>
        <p>Contaminados: {contaminados}</p>
        <p>Obitos: {obitos}</p>
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
