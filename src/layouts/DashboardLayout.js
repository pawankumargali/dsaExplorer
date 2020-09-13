import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import DashboardAlt from '../components/dashboard-alt/DashboardAlt';
import NavbarTop from '../components/navbar/NavbarTop';
import Footer from '../components/footer/Footer';
import AppContext from '../context/Context';
import RecentTxs from '../components/dashboard-alt/RecentTxs';
import DsaInfo from '../components/dsaInfo/DsaInfo';
import OwnerInfo from '../components/ownerInfo/OwnerInfo';

const DashboardLayout = ({ history }) => {
  // const { isFluid, isTopNav, navbarStyle } = useContext(AppContext);

  return (
    <div className="container-fluid">
        <div className="content" >
          <NavbarTop history={history}/>
          <Switch>
            <Route path="/" exact component={DashboardAlt} />
            <Route path="/txs" exact component={RecentTxs} />
            <Route path={"/dsa/:dsa"} component={DsaInfo} />
            <Route path={"/owner/:address"} component={OwnerInfo} />
          </Switch>
          <Footer />
        </div>
    </div>
  );
};

DashboardLayout.propTypes = { location: PropTypes.object.isRequired };

export default DashboardLayout;
