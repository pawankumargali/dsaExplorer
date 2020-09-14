import React, { Fragment  } from 'react';
import { Navbar, NavItem, Nav, Row, Col } from 'reactstrap';
// import classNames from 'classnames';
// import AppContext from '../../context/Context';
import Logo from './Logo';
import NavSearchBox from './NavSearchBox';
import TopNavRightSideNavItem from './TopNavRightSideNavItem';

const NavbarTop = ({ history }) => {

  return (
    <Fragment>
      <Navbar
        light
        className="navbar-glass fs--1 font-weight-semi-bold row navbar-top sticky-kit"
      >
        <Logo at="navbar-top" width={40} id="topLogo" />
        <Nav navbar className="align-items-center d-none d-sm-block">
          <NavItem>
            <NavSearchBox 
              icon="search" 
              placeholder="Search by address"
              className="navbar-search-form"
              history={history}
            />
          </NavItem>
        </Nav>
        <TopNavRightSideNavItem />
      </Navbar>
      <Row  lg={12} noGutters className="text-align-center d-sm-none d-md-none d-lg-none">
          <Col
            className="mb-3 pl-lg-2">
            <NavSearchBox 
              icon="search" 
              placeholder="Search by address"
              className="navbar-search-form"
              history={history}
            />
          </Col>
      </Row>
    </Fragment>
  );
};

export default NavbarTop;
