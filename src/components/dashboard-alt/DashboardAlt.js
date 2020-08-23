import React, { Fragment, useContext } from 'react';
import { Col, Row } from 'reactstrap';
import WeeklySales from './WeeklySales';
import MarketShare from './MarketShare';
import PaymentsLineChart from '../dashboard/PaymentsLineChart';
import TotalSales from './TotalSales';
import weeklySales from '../../data/dashboard/weeklySales';
import marketShare from '../../data/dashboard/marketShare';
import PurchasesTable from './PurchasesTable';
import RecentPurchasesTable from './RecentPuchasesTable';
import Flex from '../common/Flex';
import TxVolDataProvider from './TxVolDataProvider';

const DashboardAlt = () => {
  return (
    <Fragment>

      <Row noGutters>
        <Col lg={12} className="my-3 pl-md-2 pr-md-2">
          <TotalSales className="h-lg-1000" />
        </Col>
      </Row>

      <Row noGutters>
      <TxVolDataProvider>
        <Col md={5} className="col-xxl-3 mb-3 pl-md-2 pr-md-2">
          <WeeklySales />
        </Col>
        <Col md={7} className="col-xxl-3 mb-3 pl-md-2 pr-md-2">
          <MarketShare data={marketShare} />
        </Col>
      </TxVolDataProvider>
      </Row>
      <Row noGutters>
        <Col lg={12} className="my-2 pl-md-2 pr-md-2">
          <RecentPurchasesTable />
        </Col>
      </Row>

    </Fragment>
  );
};

export default DashboardAlt;
