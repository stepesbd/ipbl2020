import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'shards-react';
import { UseGetApiURL } from '../services/apiService';
import SweetAlert from 'react-bootstrap-sweetalert';

import PageTitle from './../components/common/PageTitle';
import SmallStats from './../components/common/SmallStats';
import InfectedPatients from '../components/dashboard/infectedPatients';
import CasesNumber from '../components/dashboard/CasesNumber';
import Maps from '../components/dashboard/Maps';

//const Dashboard = ({ smallStats }) => (
export default function Dashboard() {
  useEffect(() => {
    loadTotalPacientes();
    loadTotalRecuperados();
    loadTotalObitos();
  }, []);

  const [smallStats, setsmallStats] = React.useState([
    {
      label: 'Total de Pacientes',
      value: 0,
      percentage: '',
      increase: null,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '6', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(0, 184, 216, 0.1)',
          borderColor: 'rgb(0, 184, 216)',
          data: [1, 2, 1, 3, 5, 4, 7],
        },
      ],
    },
    {
      label: 'Recuperados',
      value: 0,
      percentage: 0,
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '6', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(23,198,113,0.1)',
          borderColor: 'rgb(23,198,113)',
          data: [1, 2, 3, 2, 2, 4, 4],
        },
      ],
    },
    {
      label: 'Testados Positivos',
      value: 0,
      percentage: 0,
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '4', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(255,180,0,0.1)',
          borderColor: 'rgb(255,180,0)',
          data: [2, 3, 3, 3, 4, 3, 3],
        },
      ],
    },
    {
      label: 'Óbitos',
      value: 0,
      percentage: 0,
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '4', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(255,65,105,0.1)',
          borderColor: 'rgb(255,65,105)',
          data: [1, 7, 1, 3, 1, 4, 8],
        },
      ],
    },
    {
      label: 'Pacientes com Sintomas',
      value: 0,
      percentage: 0,
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '4', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgb(0,123,255,0.1)',
          borderColor: 'rgb(0,123,255)',
          data: [3, 2, 3, 2, 4, 5, 4],
        },
      ],
    },
    {
      label: 'Leitos Disponíveis',
      value: 0,
      percentage: 0,
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '4', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgb(0,123,255,0.1)',
          borderColor: 'rgb(0,123,255)',
          data: [3, 2, 3, 2, 4, 5, 4],
        },
      ],
    },
  ]);

  const [infectedPatients, setInfectedPatients] = useState({
    datasets: [
      {
        hoverBorderColor: '#ffffff',
        data: [2045, 1399, 72],
        backgroundColor: [
          'rgb(255,180,0)',
          'rgb(23,198,113)',
          'rgb(255,65,105)',
        ],
      },
    ],
    labels: ['Contaminados', 'Recuperados', 'Óbitos'],
  });

  const [loadingT, setloadingT] = React.useState(false);
  const [totalPacientes, settotalPacientes] = React.useState(0);
  const loadTotalPacientes = () => {
    setloadingT(true);
    let endPointComplete =
      'https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/positive/amount';
    UseGetApiURL(endPointComplete).then((result) => {
      if (result.status !== 200) {
        setsalert(
          <SweetAlert warning title={result.message} onConfirm={hideAlert} />
        );
        setloadingT(false);
        return false;
      }
      setloadingT(false);
      settotalPacientes(result.data);
      return true;
    });
  };

  const [totalRecuperados, settotalRecuperados] = React.useState(0);
  const loadTotalRecuperados = () => {
    setloadingT(true);
    let endPointComplete =
      'https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/release/amount';
    UseGetApiURL(endPointComplete).then((result) => {
      if (result.status !== 200) {
        setsalert(
          <SweetAlert warning title={result.message} onConfirm={hideAlert} />
        );
        setloadingT(false);
        return false;
      }
      setloadingT(false);
      settotalRecuperados(result.data);
      return true;
    });
  };

  const [totalObitos, settotalObitos] = React.useState(0);
  const loadTotalObitos = () => {
    setloadingT(true);
    let endPointComplete =
      'https://cors-anywhere.herokuapp.com/https://stepesbdmedrecords.herokuapp.com/api/death/amount';
    UseGetApiURL(endPointComplete).then((result) => {
      if (result.status !== 200) {
        setsalert(
          <SweetAlert warning title={result.message} onConfirm={hideAlert} />
        );
        setloadingT(false);
        return false;
      }
      setloadingT(false);
      settotalObitos(result.data);
      return true;
    });
  };

  const [salert, setsalert] = React.useState();
  const hideAlert = () => {
    setsalert(null);
  };

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}

      {salert}
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Indicadores"
          subtitle="Dashboard"
          className="text-sm-left mb-3"
        />
      </Row>

      {/* Small Stats Blocks */}
      <Row>
        {smallStats.map((stats, idx) => (
          <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
            <SmallStats
              id={`small-stats-${idx}`}
              variation="1"
              chartData={stats.datasets}
              chartLabels={stats.chartLabels}
              label={stats.label}
              value={
                idx === 0
                  ? totalPacientes
                  : idx === 1
                  ? totalRecuperados
                  : idx === 2
                  ? totalPacientes
                  : idx === 3
                  ? totalObitos
                  : stats.value
              }
              percentage={stats.percentage}
              increase={stats.increase}
              decrease={stats.decrease}
            />
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg="8" md="12" sm="12" className="mb-4">
          <CasesNumber />
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <InfectedPatients
            title="Comparativo de Pacientes Infectados"
            chartData={infectedPatients}
          />
        </Col>
      </Row>

      <Row>
        <Col className="col-lg mb-4">
          {/*<Maps />*/}
        </Col>
      </Row>
    </Container>
  );
}
