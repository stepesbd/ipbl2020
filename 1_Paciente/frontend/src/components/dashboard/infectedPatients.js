import React, { useState, useEffect, createRef } from 'react';
import { Card, CardHeader, CardBody } from 'shards-react';
import { UseGetApiURL } from '../../services/apiService';
import Chart from '../../utils/chart';

function infectedPatients(props) {
  const canvasRef = createRef();
  const [title, setTitle] = useState(props.title);
  const [data, setData] = useState([976, 1501, 86]);

  const [chartData, setCharData] = useState({
    datasets: [
      {
        hoverBorderColor: '#ffffff',
        data: data,
        backgroundColor: [
          'rgba(255,180,0,0.5)',
          'rgba(23,198,113,0.5)',
          'rgba(255,65,105,0.5)',
        ],
      },
    ],
    labels: ['Contaminados', 'Recuperados', 'Óbitos'],
  });

  const [chartOptions, setChartOptions] = useState({
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
  });

  useEffect(() => {
    if (canvasRef.current !== null) {
      //console.log(canvasRef.current)
      loadData();
    }
  }, []);

  const loadData = () => {
    loadGraph(chartData);
  };

  const loadGraph = (chartData) => {
    const InfectedPatientsChart = new Chart(canvasRef.current, {
      type: 'pie',
      data: chartData,
      options: chartOptions,
    });

    InfectedPatientsChart.render();
  };

  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <CardBody className="d-flex py-0">
        <canvas
          height="220"
          ref={canvasRef}
          style={{ maxWidth: '100% !important' }}
          className="blog-users-by-device m-auto"
        />
      </CardBody>
    </Card>
  );
}

export default infectedPatients;
