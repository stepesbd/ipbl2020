import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'shards-react';

import NavBarTop from '../components/layout/MainNavbar/NavBarTop';
import MainSidebar from '../components/layout/MainSidebar/MainSidebar';
import MainFooter from '../components/layout/MainFooter';

const LoginLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <Col className="main-content p-0">
        <div
          style={{
            width: '480px',
            height: '100%',
            margin: '5% auto',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </Col>
    </Row>
  </Container>
);

LoginLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

LoginLayout.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default LoginLayout;
