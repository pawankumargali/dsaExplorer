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
import SupplyBorrowStatus from './SupplyBorrowStatus';
import SupplyBorrowStatusDot from './SupplyBorrowStatusDot';



const Net = ({ values }) => {

  const { isDark, currency } = useContext(AppContext);
  const colors = {
    supply: isDark ? 'secondary':'success',
    borrow: isDark ? 'danger' : 'warning'
  }
  const supplyBorrowStatusDotColors = [
    {
        name: 'Supply',
        color: colors['supply'],
        size:0
    },
    {
        name: 'Borrow',
        color: colors['borrow'],
        size:0
    },
  
  ];

  const { supply, borrow } = values; 
  const progressBarVals=[];
    progressBarVals.push({ name:'Supply', size:supply.usd, sizeInEth:supply.eth, color:colors['supply'] });
    progressBarVals.push({ name:'Borrow', size:borrow.usd, sizeInEth:borrow.eth, color:colors['borrow'] });

 
  return (
    <Card className="h-md-100">
    
      <FalconCardHeader className="pb-0" title="Net" light={false} titleTag="h5">
      <Row className="fs--1 font-weight-semi-bold">
        {supplyBorrowStatusDotColors.map((d, index) => (
            <SupplyBorrowStatusDot {...d} isFirst={index === 0} isLast={supplyBorrowStatusDotColors.length - 1 === index} key={index} />
        ))}
        </Row>
      </FalconCardHeader>
      <CardBody tag={Flex} align="center">
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
        <Col xs="auto" className="pl-0" className="supply-borrow-status-col">
          <SupplyBorrowStatus 
              data={progressBarVals}
              height={30}
              width={300}
          />
        </Col>
      </Row>
      </CardBody>
    </Card>
  );
};

export default Net;
