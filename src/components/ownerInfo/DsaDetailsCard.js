import React, { Fragment, useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Col, Row, Card } from 'reactstrap';
// import ButtonIcon from '../common/ButtonIcon';

// import Flex from '../common/Flex';
import NetPositionCard from '../dsaInfo/NetPositionCard';
import PositionsBreakupChart from '../dsaInfo/PositionsBreakupChart';
import Balances from '../dsaInfo/Balances';
import BalancesBreakup from '../dsaInfo/BalancesBreakup';
// import DetailedPosition from './DetailedPosition';
// import Owners from './Owners';
// import RecentDSATxs from '../dsaInfo/RecentDSATxs';
// import FalconCardHeader from '../common/FalconCardHeader';

import PositionsDataProvider from '../dsaInfo/PositionsDataProvider';
import BalancesDataProvider from '../dsaInfo/BalancesDataProvider';
import DsaTitleCard from './DsaTitleCard';

const DsaDetailsCard = ({ dsaAddress }) =>  {

    return (
        <Fragment>
          <Row noGutters>
            
            <Col lg={12} className="col-xxl-3 mb-1 pr-md-2">
              <DsaTitleCard dsaAddress={dsaAddress} />
            </Col>
          </Row>

          <Row noGutters className="my-2">
            
            <Col lg={6} className="col-xxl-3 mb-1">
            <PositionsDataProvider>
              <NetPositionCard 
                dsaAddress={dsaAddress} 
              />
            </PositionsDataProvider>
            </Col>
            
            <Col lg={6} className="col-xxl-3 mb-1 pl-md-2 pr-md-2">
              <BalancesDataProvider>
                <Balances 
                  dsaAddress={dsaAddress} 
                />
              </BalancesDataProvider>
            </Col>
          </Row>

          
          <Row noGutters className="my-1">
            
            <Col lg={6} className="col-xxl-3 mb-1">
              <PositionsDataProvider>
                <PositionsBreakupChart 
                  dsaAddress={dsaAddress} 
                />
              </PositionsDataProvider>
            </Col>
            
            <Col lg={6} className="col-xxl-3 mb-1 pl-md-2 pr-md-2">
              <BalancesBreakup dsaAddress={dsaAddress} />
            </Col>

          </Row>
         
          {/* <Row noGutters className="my-1">
            <Col lg={12} className="col-xxl-3 mb-1 pl-md-2 pr-md-0">
              <RecentDSATxs 
                dsaAddress={dsaAddress}
              />
            </Col>
    </Row> */}

        </Fragment>
      );
  
};

export default DsaDetailsCard;