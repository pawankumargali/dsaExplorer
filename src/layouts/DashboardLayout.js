import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import DashboardAlt from '../components/dashboard-alt/DashboardAlt';
import NavbarTop from '../components/navbar/NavbarTop';
import Footer from '../components/footer/Footer';
import { Row, Col } from 'reactstrap';
import AppContext from '../context/Context';
import SearchBox from '../components/navbar/SearchBox';
import AllRecentTxs from '../components/dashboard-alt/AllRecentTxs';


const DashboardLayout = ({ location }) => {
  const { isFluid, isTopNav, navbarStyle } = useContext(AppContext);

  return (
    <div className="container-fluid">
        <div className="content" >
          <NavbarTop />
          <Switch>
            {/* <Route path="/dashboard" exact component={Dashboard} /> */}
            <Route path="/" exact component={DashboardAlt} />
            <Route path="/txs" exact component={AllRecentTxs} />
          </Switch>
          <Footer />
        </div>
    </div>
  );
};

DashboardLayout.propTypes = { location: PropTypes.object.isRequired };

export default DashboardLayout;
