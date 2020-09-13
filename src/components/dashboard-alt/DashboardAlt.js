import React, { Fragment, useContext } from 'react';
import { Col, Row } from 'reactstrap';
import CreationTimeline from './CreationTimeline';
import TxVolDataProvider from './TxVolDataProvider';
import TxVolume from './TxVolume';
import TxVolumeBreakup from './TxVolumeBreakup';
import RecentTxs from  './RecentTxs';

const DashboardAlt = () => {
  return (
    <Fragment>

      <Row noGutters>
        <Col lg={12} className="my-3 pl-md-2 pr-md-2">
          <CreationTimeline className="h-lg-1000" />
        </Col>
      </Row>

      <Row noGutters>
      <TxVolDataProvider>
        <Col md={5} className="col-xxl-3 mb-3 pl-md-2 pr-md-2">
          <TxVolume />
        </Col>
        <Col md={7} className="col-xxl-3 mb-3 pl-md-2 pr-md-2">
          <TxVolumeBreakup />
        </Col>
      </TxVolDataProvider>
      </Row>

      <Row noGutters>
        <Col lg={12} className="my-2 pl-md-2 pr-md-2">
          <RecentTxs  isPreview={true}/>
        </Col>
      </Row>

    </Fragment>
  );
};

export default DashboardAlt;
