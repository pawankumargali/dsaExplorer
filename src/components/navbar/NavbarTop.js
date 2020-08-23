import React, { useContext, useState, Fragment } from 'react';
import { Collapse, CustomInput, Navbar, NavItem, Nav, Row, Col } from 'reactstrap';
import classNames from 'classnames';
import AppContext from '../../context/Context';
import Logo from './Logo';
import SearchBox from './SearchBox';

import TopNavRightSideNavItem from './TopNavRightSideNavItem';


const NavbarTop = () => {

  return (
    <Fragment>
      <Navbar
        light
        className="navbar-glass fs--1 font-weight-semi-bold row navbar-top sticky-kit"
      >
        <Logo at="navbar-top" width={40} id="topLogo" />
        <Nav navbar className="align-items-center d-none d-sm-block">
          <NavItem>
            <SearchBox />
          </NavItem>
        </Nav>
        <TopNavRightSideNavItem />
      </Navbar>
      <Row  lg={12} noGutters className="text-align-center d-sm-none d-md-none d-lg-none">
          <Col
            className="mb-3 pl-lg-2">
            <SearchBox />
          </Col>
      </Row>
    </Fragment>
  );
};

export default NavbarTop;
