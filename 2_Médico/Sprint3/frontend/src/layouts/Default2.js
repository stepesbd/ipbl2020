import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import NavBarTop from "../components/layout/MainNavbar/NavBarTop";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";

const Default2Layout = ({ children, noNavbar, noFooter }) => (
  
  <Container fluid>
    <Row>
      <Col className="main-content p-0">        
        <NavBarTop></NavBarTop>
        <div  style={{width:'480px',height:'95%',margin:'0 auto',overflow:'hidden'}}>
        {children}
        </div>
        {!noFooter && <MainFooter />}
      </Col>
    </Row>
  </Container>
);

Default2Layout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

Default2Layout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default Default2Layout;
