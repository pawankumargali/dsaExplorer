import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter, Progress } from 'reactstrap';
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
import { update } from 'lodash';





const Status = ({ position, values, currentAsset, currentVault }) => {

  const { isDark, currency } = useContext(AppContext);
  const [status, setStatus] = useState({current:0, liquidation:100});

  const updateStatus = () => {
    let {status:current, liquidation} = currentAsset==='maker' ? position[currentVault] : position;
    current = isNaN(current) ? 0 : Math.round(current*100);
    liquidation = isNaN(liquidation) ? 'NaN' : Math.round(liquidation*100);
    setStatus({current, liquidation});
  }
  
  useEffect(() => {
    updateStatus();
  }, [values.supply.usd]);

  return (
    <Card className="h-md-100">
      <FalconCardHeader className="pb-0 mb-0" title="Status" light={false} titleTag="h5">
      <Flex align="center" justify="start">
      <Badge color="soft-warning" className="fs--1" style={{fontSize:'12px', width:'72px', margin:'0'}}>
        Max {!isNaN(status.liquidation) ? status.liquidation+'%' : 'NaN'}
      </Badge>
      </Flex>
      </FalconCardHeader>
      <CardBody tag={Flex} align="center">
        <Progress
          value={status.current===0 ? 1 : (status.current/status.liquidation)*100}
          color={(status.current/status.liquidation)>=1 ? "warning" : "primary"}
          className="w-100 mr-2 rounded-soft bg-200"
          barClassName="rounded-capsule"
          style={{ height: '5px' }}
        />
      
        <div className="font-weight-semi-bold ml-2">{status.current}%</div>          
      </CardBody>
    </Card>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default Status;
