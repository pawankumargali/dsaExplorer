import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import Flex from '../common/Flex';
import DsaInfo from '../dsaInfo/DsaInfo';
import OwnedDSAs from './OwnedDSAs';
// import DsaDetailsCard from './DsaDetailsCard';

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



const OwnerInfo = ({ match }) =>  {

  const { address: ownerAddress } = match.params;

  const [dsaAddress, setDsaAddress] = useState('');
  // const [dsaId, setDsaId] = useState(0);
  
  // const [isDsaChanged, setIsDsaChanged] = useState(false);

  // useEffect(() => {
  //   setDsaAddress(dsaAddress);
  // },[dsaAddress]);

    return (
        <Fragment>
        <h5 className="mt-4 mb-2 pb-0 pl-md-2">Owner
          <a 
            href={`https://etherscan.io/address/${ownerAddress}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {' '+ownerAddress}
          </a>
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
          {dsaAddress!=='' &&
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
              <BalancesBreakup dsaAddress={dsaAddress} />
            </Col>

          </Row>
            </Col>
          }

        </Row>

        </Fragment>
    );
  
};

export default OwnerInfo;

{/* <Fragment>
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
    <NetPositionCard 
      dsaAddress={dsaAddress} 
      isPreview={true}
    />
  </Col>
  
  <Col lg={4} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
    <BalancesDataProvider>
      <Balances 
        dsaAddress={dsaAddress} 
        isPreview={true}
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
//   </Col>

//   <Col lg={12} className="col-xxl-3 mb-1 pl-md-2 pr-md-0">
//   {/* <Owners dsaAddress={dsaAddress} /> */}

//     <RecentDSATxs 
//       dsaAddress={dsaAddress}
//     />
//   </Col>
// </Row>

// </Fragment> */}