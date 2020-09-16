import React, { Fragment, useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import OwnedDSAs from './OwnedDSAs';
import NetPositionCard from '../dsaInfo/NetPositionCard';
import PositionsBreakupChart from '../dsaInfo/PositionsBreakupChart';
import Balances from '../dsaInfo/Balances';
import BalancesBreakup from '../dsaInfo/BalancesBreakup';
import PositionsDataProvider from '../dsaInfo/PositionsDataProvider';
import BalancesDataProvider from '../dsaInfo/BalancesDataProvider';
import OwnerAddress from './OwnerAddress';
import DsaTitleCard from './DsaTitleCard';



const OwnerInfo = ({ match }) =>  {

  const { address: ownerAddress } = match.params;

  const [dsaAddress, setDsaAddress] = useState('');

    return (
        <Fragment>
        <h5 className="mt-4 mb-2 pb-0 pl-md-2">
         <OwnerAddress ownerAddress={ownerAddress} />
        </h5>

        <Row noGutters className="mt-4 mb-2">
            <Col lg={2} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
                <OwnedDSAs
                    ownerAddress={ownerAddress} 
                    currentDsa={dsaAddress}
                    setCurrentDsa={setDsaAddress} 
                    // setIsDsaChanged={setIsDsaChanged}
                />
            </Col>
          {!!dsaAddress && dsaAddress!=='' &&
            <Col lg={10} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
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
            <BalancesDataProvider>
              <BalancesBreakup dsaAddress={dsaAddress} />
            </BalancesDataProvider>
            </Col>

          </Row>
            </Col>
          }

        </Row>

        </Fragment>
    );
  
};

export default OwnerInfo;