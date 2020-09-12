import React, { Fragment, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Card } from 'reactstrap';
import Flex from '../common/Flex';
import NetPositionCard from './NetPositionCard';
import PositionsBreakupChart from './PositionsBreakupChart';
import Balances from './Balances';
import BalancesBreakup from './BalancesBreakup';
import DetailedPosition from './DetailedPosition';
import Owners from './Owners';
import RecentDSATxs from './RecentDSATxs';

import PositionsDataProvider from './PositionsDataProvider';
import BalancesDataProvider from './BalancesDataProvider';

const DsaInfo = ({ match }) =>  {

  const { address: dsaAddress } = match.params;

    return (
        <Fragment>
          <h5 className="mt-4 mb-2 pb-0 pl-md-2">DSA 
            <a 
              href={`https://etherscan.io/address/${dsaAddress}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {' '+dsaAddress}
            </a>
          </h5>
          
          <Row noGutters className="my-2">
            <Col lg={2} className="col-xxl-3 mb-2 pl-md-2 pr-md-2 d-lg-none">
                <Owners 
                  dsaAddress={dsaAddress}  
                />
            </Col>
            
            <Col lg={6} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
              <PositionsDataProvider>
              <NetPositionCard 
                dsaAddress={dsaAddress} 
              />
              </PositionsDataProvider>
            </Col>
            
            <Col className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
              <BalancesDataProvider>
                <Balances 
                  dsaAddress={dsaAddress} 
                />
              </BalancesDataProvider>
            </Col>
            <Col lg={2} className="col-xxl-3 mb-2 pl-md-2 pr-md-2 d-none d-lg-block">
                <Owners 
                  dsaAddress={dsaAddress}  
                />
            </Col>
          </Row>

          
          <Row noGutters className="my-1">
            
            <Col lg={6} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
              <PositionsDataProvider>
                <PositionsBreakupChart 
                  dsaAddress={dsaAddress} 
                />
              </PositionsDataProvider>
            </Col>

            <Col lg={6} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
              <BalancesBreakup dsaAddress={dsaAddress} />
            </Col>

          </Row>

          <Row noGutters className="my-1">
            <Col lg={12} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
              <PositionsDataProvider>
                <DetailedPosition dsaAddress={dsaAddress} />
              </PositionsDataProvider>
              </Col>
          </Row>
         
          <Row noGutters lg={12} className="my-1">
            <Col lg={2} className="col-xxl-3 mb-1 pl-md-2 pr-md-0">
              {/* <Supply 
                values={values}
              /> */}
              {/* <Owners dsaAddress={dsaAddress} /> */}
            </Col>

            <Col lg={12} className="col-xxl-3 mb-1 pl-md-2 pr-md-0">
            {/* <Owners dsaAddress={dsaAddress} /> */}

              <RecentDSATxs 
                dsaAddress={dsaAddress}
              />
            </Col>
    </Row>

        </Fragment>
      );
  
};

export default DsaInfo;