import React, { useContext, useState, useEffect, Fragment } from 'react';
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

const TokenSupplyItem = ({ token, supply, asset, supplyRate }) => {

  const { isDark, currency } = useContext(AppContext);
  const labels = {
    'maker':'Collateral',
    'compound':'Lent',
    'aave':'Lent',
    'dydx':'Lent',
  }
  // const {value, usd} = supply;
  // console.log(token,supply);
  return (
    <Col className="col-xxl-3 mb-2 pl-md-3 pr-md-0">
    <Card className="h-md-100">
      <FalconCardHeader className="pb-0" 
        title={
        <Flex align="center" justify="start">  
            <img src={tokens[token].icon} alt={token} style={{marginRight:'10px',width:'24px'}} />
            <span>{tokens[token].name}</span>
        </Flex>
        } 
        light={false} titleTag="h5">
          {asset!=='maker' &&
            <Badge color="soft-info" className="fs--2">
              <span className="mx-2">{'Supply Rate: '+Math.round(supplyRate)+'%'}</span>
            </Badge>
          }
        </FalconCardHeader>
      <CardBody tag={Flex} align="start">
      {/* <Row className="h-100 flex-grow-1" >
      <Col>
      <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
              {currency}
              <span className="mx-2">{!supply ? 0 : numberFormatter(supply.usd, 2)}</span>
            </div>
            <Badge pill color="soft-success" className="fs--1 mt-2">
              <img src={tokens[token].icon} alt={token} style={{width:'20px'}}/>
              <span className="mx-2">{!supply ? 0 : numberFormatter(supply.value, 2)}</span>
            </Badge>  
            </Col>    
      </Row> */}
      <Row className="flex-grow-1" tag={Flex} align="start">
      <Col className="align-self-center">
        <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
                {currency}
                <span className="mx-2">{!supply ? 0 : numberFormatter(supply.usd, 2)}</span>
        </div>
        <Badge pill color="soft-success" className="fs--1 mt-2">
          <img src={tokens[token].icon} alt={token} style={{width:'20px'}}/>
          <span className="mx-2">{!supply ? 0 : numberFormatter(supply.value, 2)}</span>
        </Badge>  
      </Col>
      <Col xs="auto" className="pl-0">
            <Badge color="soft-success" className="fs--1 mt-2">
            <span className="mx-2">{labels[asset]}</span>            
          </Badge>
      </Col> 
      </Row>
      </CardBody>
    </Card>
    </Col>
    //<div>Hi</div>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default TokenSupplyItem;
