import React, { useEffect, useState }  from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import { UseGetApiURL } from '../../services/apiService';
import SweetAlert from 'react-bootstrap-sweetalert';

import RangeDatePicker from "../common/RangeDatePicker";
import Chart from "../../utils/chart";


export default function CasesNumber() {

    const canvasRef = React.useRef();

    const [title,settitle] = React.useState("Número de Casos");
    const [dataC, setdataC] = React.useState([
      500,
      800,
      320,
      4250
    ]);
    const [chartData,setchartData]  = React.useState({
        labels: [
          '01/06/2020',
          '02/06/2020',
          '03/06/2020',
          '04/06/2020'
        ],
        datasets: [
          {
            label: "Casos Positivos",
            fill: "start",
            data: dataC,
            backgroundColor: "rgba(0,123,255,0.1)",
            borderColor: "rgba(0,123,255,1)",
            pointBackgroundColor: "#ffffff",
            pointHoverBackgroundColor: "rgb(0,123,255)",
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 3
          }, 
          /*{
            label: "Óbitos",
            fill: "start",
            data: [
              380,
              430,
              120,
              1200
            ],
            backgroundColor: "rgba(255,65,105,0.1)",
            borderColor: "rgba(255,65,105,1)",
            pointBackgroundColor: "#ffffff",
            pointHoverBackgroundColor: "rgba(255,65,105,1)",
            borderDash: [3, 3],
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 2,
            pointBorderColor: "rgba(255,65,105,1)"
          }*/
        ]
    });
    const [chartOptions,setchartOptions] = React.useState({
        responsive: true,
        legend: {
          position: "top"
        },
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.3
          },
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: false,
              /*ticks: {
                callback(tick, index) {
                  // Jump every 7 values on the X axis labels to avoid clutter.
                  return index % 7 !== 0 ? "" : tick;
                }
              }*/
            }
          ],
          yAxes: [
            {
              ticks: {
                suggestedMax: 45,
                callback(tick) {
                  if (tick === 0) {
                    return tick;
                  }
                  // Format the amounts using Ks for thousands.
                  return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
                }
              }
            }
          ]
        },
        hover: {
          mode: "nearest",
          intersect: false
        },
        tooltips: {
          custom: false,
          mode: "nearest",
          intersect: false
        }
    });

    useEffect(() => {
      if (canvasRef.current!==null) {
        //console.log(canvasRef.current)
        loadData();
      }
    }, []);

    const [loading, setloading] = React.useState(false);
    const [numeroCasosbyDate, setnumeroCasosbyDate] = React.useState([]);
    const loadData = () => {
      setloading(true);
      let endPointComplete =
        'https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/positive';
        UseGetApiURL(endPointComplete).then((result) => {
        if (result.status !== 200) {
          //setsalert(<SweetAlert warning title={result.message} onConfirm={hideAlert} />);
          setloading(false);
          return false;
        }
        setloading(false);
        let resultado = result.data;
        console.log(resultado)

        let dataQtd = []
        let dataDate = []
        resultado.map(element => {
          dataQtd.push(element.number);
          dataDate.push(element._id.day+"/"+element._id.month+"/"+element._id.year);
        });
        let dados = {
          labels: dataDate,
          datasets: [
            {
              label: "Casos Positivos",
              fill: "start",
              data: dataQtd,
              backgroundColor: "rgba(0,123,255,0.1)",
              borderColor: "rgba(0,123,255,1)",
              pointBackgroundColor: "#ffffff",
              pointHoverBackgroundColor: "rgb(0,123,255)",
              borderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 3
            }
          ]
        }
        loadGraph(dados);
        
        return true;
      });

      
    };

    const loadGraph = (chartData) =>{
      
      console.log(chartData)
      const BlogUsersOverview = new Chart(canvasRef.current, {
        type: "LineWithLine",
        data: chartData,
        options: chartOptions
      });
  
      // They can still be triggered on hover.
      //const buoMeta = BlogUsersOverview.getDatasetMeta(0);
      //buoMeta.data[0]._model.radius = 0;
      /*buoMeta.data[
        dataG.datasets[0].data.length - 1
      ]._model.radius = 0;*/
  
      // Render the chart.
      BlogUsersOverview.render();
    }
  
  return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="pt-0">
          {/*<Row className="border-bottom py-2 bg-light">
            <Col sm="6" className="d-flex mb-2 mb-sm-0">
              <RangeDatePicker />
            </Col>
            <Col>
              <Button
                size="sm"
                className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
              >
                View Full Report &rarr;
              </Button>
            </Col>
          </Row>*/}
          <canvas
            height="120"
            ref={canvasRef}
            style={{ maxWidth: "100% !important" }}
          />
        </CardBody>
      </Card>
    );
}
