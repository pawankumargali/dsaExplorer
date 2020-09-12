import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CloseButton, Fade } from '../components/common/Toast';

import DashboardLayout from './DashboardLayout';
import ErrorLayout from './ErrorLayout';

import loadable from '@loadable/component';

const Layout = () => {
 
  return (
    <Router fallback={<span />}>
      <Switch>
        <Route component={DashboardLayout} />
        <Route path="/errors" component={ErrorLayout} />
      </Switch>
      <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.BOTTOM_LEFT} />
    </Router>
  );
};

export default Layout;
  
