import React from 'react';
import { Container, Row, Col } from 'shards-react';

const LoginLayout = ({ children }) => (
  <Container fluid>
    <Row>
      <Col className="main-content p-0">
        <div
          style={{
            width: '480px',
            height: '95%',
            margin: '0 auto',
            overflow: 'hidden',
            flex: '1',
            alignContent: 'center',
            justifyContent: 'center',
            paddingTop: '10%',
          }}
        >
          {children}
        </div>
      </Col>
    </Row>
  </Container>
);

export default LoginLayout;
