import React from 'react';
import { Col, Row } from 'reactstrap';
import { version } from '../../config';

const Footer = () => (
  <footer>
    <Row noGutters className="justify-content-between text-center fs--1 mt-4 mb-3">
      <Col sm="auto">
        <p className="mb-0 text-600">
          DSA Explorer &copy; {new Date().getFullYear()}  <span className="d-none d-sm-inline-block">| </span>
          <br className="d-sm-none" />  
          {/* {new Date().getFullYear()} &copy; */}
           {/* <a href="https://themewagon.com">Themewagon</a> */}
           <span>Built on </span>
           <a href="https://instadapp.io/">InstaDApp</a>
           <span> DSA SDK</span>

        </p>
      </Col>
      <Col sm="auto">
        <p className="mb-0 text-600">v{version}</p>
      </Col>
    </Row>
  </footer>
);

export default Footer;
