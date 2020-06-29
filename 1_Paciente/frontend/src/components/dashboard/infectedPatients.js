import React, { useState, useEffect, createRef } from "react";
import { Card, CardHeader, CardBody } from "shards-react";
import { UseGetApiURL } from "../../services/apiService";
import Chart from "../../utils/chart";

function infectedPatients(props) {
  const canvasRef = createRef();
  const [title, setTitle] = useState(props.title);
  const [data, setData] = useState([10, 20, 30]);

  const [chartData, setCharData] = useState({
    datasets: [
      {
        hoverBorderColor: "#ffffff",
        data: data,
        backgroundColor: [
          "rgba(0,123,255,0.9)",
          "rgba(0,123,255,0.5)",
          "rgba(0,123,255,0.3)"
        ]
      }
    ],
    labels: ["Contaminados", "Recuperados", "Óbitos"]
  });

  const [chartOptions, setChartOptions] = useState({
    legend: {
      position: "bottom",
      labels: {
        padding: 25,
        boxWidth: 20
      }
    },
    cutoutPercentage: 0,
    tooltips: {
      custom: false,
      mode: "index",
      position: "nearest"
    }
  });

  useEffect(() => {
    if (canvasRef.current !== null) {
      //console.log(canvasRef.current)
      loadData();
    }
  }, []);

  const loadData = () => {
    let positive, release, death;
    let urlPositive =
      "https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/positive/amount";
    let urlRelease =
      "https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/release/amount";
    let urlDeath =
      "https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/death/amount";

    UseGetApiURL(urlPositive).then(result => {
      if (result.status !== 200) {
        return false;
      }
      let newValue = result.data;
      let newData = {
        datasets: [
          {
            hoverBorderColor: "#ffffff",
            data: [newValue, newValue, newValue],
            backgroundColor: [
              "rgba(0,123,255,0.9)",
              "rgba(0,123,255,0.5)",
              "rgba(0,123,255,0.3)"
            ]
          }
        ],
        labels: ["Contaminados", "Recuperados", "Óbitos"]
      };
      loadGraph(chartData);
    });
  };

  const loadGraph = chartData => {
    console.log(chartData);
    const InfectedPatientsChart = new Chart(canvasRef.current, {
      type: "pie",
      data: chartData,
      options: chartOptions
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
          style={{ maxWidth: "100% !important" }}
          className="blog-users-by-device m-auto"
        />
      </CardBody>
    </Card>
  );
}

export default infectedPatients;
