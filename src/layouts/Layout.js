import React from 'react';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CloseButton, Fade } from '../components/common/Toast';
import DashboardLayout from './DashboardLayout';
import ErrorLayout from './ErrorLayout';

const Layout = () => {
 
  return (
    <Router fallback={<span />}>
      <Switch>
        <Route path="/error" component={ErrorLayout} />
        <Route component={DashboardLayout} /> 
      </Switch>
      <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.BOTTOM_LEFT} />
    </Router>
  );
};

export default Layout;
  
