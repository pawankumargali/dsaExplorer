import React, { useContext } from 'react';
import {CustomInput, Nav, NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';
import weatherIconDark from '../../assets/img/icons/weather-icon-dark.png'
import weatherIconLight from '../../assets/img/icons/weather-icon-light.png'

import AppContext from '../../context/Context';

const TopNavRightSideNavItem = () => {
  const { isTopNav, isDark, setIsDark } = useContext(AppContext);
  return (
    <Nav navbar className="navbar-nav-icons ml-auto flex-row align-items-center d-lg-block">
      <NavItem>
        <CustomInput
            type="switch"
            id="theme-mode-dark"
            label={<img className="mr-3" src={isDark ? weatherIconDark : weatherIconLight} alt="" height="25" />}
            checked={!isDark}
            onChange={({ target }) => setIsDark(!target.checked)}
          />
      </NavItem>
      
    </Nav>
  );
};

export default TopNavRightSideNavItem;
