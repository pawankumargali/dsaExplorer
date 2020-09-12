import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter, isIterableArray, themeColors, getPosition, getGrays, colors } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext } from '../../context/Context';
import { getBalances } from '../../dsaInterface';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ethIcon from '../../assets/img/tokens/eth.svg';
import tokens from '../../tokens';
import BalanceItem from './BalanceItem';
import StorageStatus from './StorageStatus';
import StorageStatusDot from './StorageStatusDot';



const Net = ({ values }) => {

  const { isDark, currency } = useContext(AppContext);
  const storageStatusDotColors = [
    {
        name: 'Supply',
        color: 'success',
        size:0
    },
    {
        name: 'Borrow',
        color: 'warning',
        size:0
    },

];
  const { supply, borrow } = values; 

  // const [progressBarVals, setProgressBarVals] = useState([]);
  // const [areValsSet, setAreValsSet] = useState(false);
  const progressBarVals=[];
    progressBarVals.push({ name:'Supply', size:supply.usd, sizeInEth:supply.eth, color:'success' });
    progressBarVals.push({ name:'Borrow', size:borrow.usd, sizeInEth:borrow.eth, color:'warning' });

//   const updateProgressBar = () => {
//     const progress=[];
//     progress.push({ name:'Supply', size:supply.usd, sizeInEth:supply.eth, color:'success' });
//     progress.push({ name:'Borrow', size:borrow.usd, sizeInEth:borrow.eth, color:'warning' });
//     setProgressBarVals(progress);
//     setAreValsSet(true);
// };

// useEffect(() => {
//   if(!areValsSet && progressBarVals.length===0)
//     updateProgressBar();
// }, [areValsSet])

 
  return (
    <Card className="h-md-100">
    
      <FalconCardHeader className="pb-0" title="Net" light={false} titleTag="h5">
      <Row className="fs--1 font-weight-semi-bold">
        {storageStatusDotColors.map((d, index) => (
            <StorageStatusDot {...d} isFirst={index === 0} isLast={storageStatusDotColors.length - 1 === index} key={index} />
        ))}
        </Row>
      </FalconCardHeader>
      <CardBody tag={Flex} align="center">
      {/* <Row className="h-100 flex-grow-1" tag={Flex} align="center"> */}
      {/* <Col>
      <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
              {currency}
              <span className="mx-2">{numberFormatter(supply.usd-borrow.usd, 2)}</span>
            </div>
            <Badge pill color="soft-success" className="fs--1 mt-2">
              <img src={ethIcon} alt="eth-icon" style={{width:'20px'}}/>
              <span className="mx-2">{numberFormatter(supply.eth-borrow.eth, 2)}</span>
            </Badge>  
      </Col>     */}
      <Row className="flex-grow-1" tag={Flex} align="end">
      <Col className="align-self-center">
          <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
            {currency+' '+numberFormatter(supply.usd-borrow.usd, 2)}
          </div>
          <Badge pill color="soft-info" className="fs--2">
          <img src={ethIcon} alt="eth-icon" style={{width:'20px'}}/>
            <span className="mx-2">{numberFormatter(supply.eth-borrow.eth, 2)}</span>
          </Badge>
        </Col>
        <Col xs="auto" className="pl-0" id="bals-breakup-chart">
          <StorageStatus 
              data={progressBarVals}
              height={30}
              width={300}
          />
        </Col>


      </Row>
      </CardBody>
    </Card>

    //  {/* <Row className="flex-grow-1" tag={Flex} align="end"> */}
       
    // </Row>


  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default Net;
