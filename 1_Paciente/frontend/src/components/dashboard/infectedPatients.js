import React from 'react';
import {
  Row,
  Col,
  FormSelect,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from 'shards-react';

import Chart from '../../utils/chart';

class UsersByDevice extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const chartConfig = {
      type: 'pie',
      data: this.props.chartData,
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

    new Chart(this.canvasRef.current, chartConfig);
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="d-flex py-0">
          <canvas
            height="220"
            ref={this.canvasRef}
            className="blog-users-by-device m-auto"
          />
        </CardBody>
        <CardFooter className="border-top">
          <Row>
            <Col>
              <FormSelect
                size="sm"
                value="last-week"
                style={{ maxWidth: '130px' }}
                onChange={() => {}}
              >
                <option value="last-week">Ãšltima Semana</option>
                <option value="today">Hoje</option>
                <option value="last-month">Ãšltimo MÃªs</option>
                <option value="last-year">Ãšltimo Ano</option>
              </FormSelect>
            </Col>
            <Col className="text-right view-report">
              {/* eslint-disable-next-line */}
              <a href="#">Visualizar Dados &rarr;</a>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  }
}

export default UsersByDevice;
