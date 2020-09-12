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





const Borrow = ({ values }) => {

  const { isDark, currency } = useContext(AppContext);
  const { borrow } = values; 
  return (
    <Card className="h-md-100">
      <FalconCardHeader className="pb-0" title="Borrow" light={false} titleTag="h5" />
      <CardBody tag={Flex} align="start">
      <Row className="h-100 flex-grow-1" >
      <Col>
      <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
              {currency}
              <span className="mx-2">{numberFormatter(borrow.usd, 2)}</span>
            </div>
            <Badge pill color="soft-success" className="fs--1 mt-2">
              <img src={ethIcon} alt="eth-icon" style={{width:'20px'}}/>
              <span className="mx-2">{numberFormatter(borrow.eth, 2)}</span>
            </Badge>  
            </Col>    
      </Row>
      </CardBody>
    </Card>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default Borrow;
