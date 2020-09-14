import React, { Fragment, useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import NetPositionCard from './NetPositionCard';
import PositionsBreakupChart from './PositionsBreakupChart';
import Balances from './Balances';
import BalancesBreakup from './BalancesBreakup';
import DetailedPosition from './DetailedPosition';
import Owners from './Owners';
import RecentDSATxs from './RecentDSATxs';
import PositionsDataProvider from './PositionsDataProvider';
import BalancesDataProvider from './BalancesDataProvider';
import { getDsaAddressById, getDsaIdByAddress } from '../../helpers/dsaInterface';
import DsaIdAndAddress from './DsaIdAndAddress';

const DsaInfo = ({ match, history }) =>  {

  // route param :dsa can be the dsaId or dsaAddress
  const { dsa } = match.params;

  const [dsaAddress, setDsaAddress] = useState('');
  const [dsaId, setDsaId] = useState(0);

  const updateDsaAddress = async () => {
    const [address, id] = await Promise.all([ getDsaAddressById(dsa), getDsaIdByAddress(dsa)]);
    // if param :dsa is DSAId
    if(address!='0x0000000000000000000000000000000000000000') {
      setDsaId(dsa);
      setDsaAddress(address);
      return;
    }
    // If param :dsa is DSA Address
    if(id!==0) {
      setDsaId(id);
      setDsaAddress(dsa);
      return;
    }
    // If not DSA address or id => redirect to 404 error Page
    return history.push(`/errors/404`);
  }

  useEffect(() => {
    if(dsaAddress!=='')
      setDsaAddress('')
  }, [dsa])
  useEffect(() => {
    if(dsaAddress==='')
      updateDsaAddress();
  }, [dsaAddress]);

    return (
      <div>
        {dsaAddress!=='' &&
        <Fragment>
          <h5 className="mt-4 mb-2 pb-0 pl-md-0 pr-md-0">
           <DsaIdAndAddress 
             dsaAddress={dsaAddress}
             dsaId={dsaId}
           />
          </h5>
          
          {/* md-display owners */}
          <Row noGutters className="my-2">
            <Col md={12} className="col-xxl-3 mb-2 pl-md-2 pr-md-2 d-lg-none">
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
            
            {/* lg-display Balances */}
            <Col  lg={4} className="col-xxl-3 mb-2 pl-md-2 pr-md-2 d-none d-lg-block">
              <BalancesDataProvider>
                <Balances 
                  dsaAddress={dsaAddress} 
                />
              </BalancesDataProvider>
            </Col>
            {/* lg-display Owners */}
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

            {/* md-display balances */}
            <Col  md={12} className="col-xxl-3 mb-2 pl-md-2 pr-md-2 d-block d-lg-none">
              <BalancesDataProvider>
                <Balances 
                  dsaAddress={dsaAddress} 
                />
              </BalancesDataProvider>
            </Col>

            <Col lg={6} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
              <BalancesDataProvider>
                <BalancesBreakup dsaAddress={dsaAddress} />
              </BalancesDataProvider>
            </Col>

          </Row>

          <Row noGutters className="my-1">
            <Col lg={12} className="col-xxl-3 mb-2 pl-md-2 pr-md-2">
              <PositionsDataProvider>
                <DetailedPosition dsaAddress={dsaAddress} />
              </PositionsDataProvider>
              </Col>
          </Row>
         
          <Row noGutters className="my-1">
            <Col lg={12} className="col-xxl-3 mb-1 pl-md-2 pr-md-0">
              <RecentDSATxs 
                dsaAddress={dsaAddress}
              />
            </Col>
    </Row>

        </Fragment>
        }
        </div>
      );
  
};

export default DsaInfo;