import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter, isIterableArray, themeColors, getPosition, getGrays, colors } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext, BalancesDataContext } from '../../context/Context';
import { getBalances } from '../../dsaInterface';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ethIcon from '../../assets/img/tokens/eth.svg';
import BalanceItem from './BalanceItem';


const getOption = (data, isDark) => {
  for(const each in data) {
    data[each].value=data[each].usd;
  }
  const grays = getGrays(isDark);
  return {
    color: data.map(d => d.color),
    tooltip: {
      trigger: 'item',
      padding: [7, 10],
      backgroundColor: grays.white,
      textStyle: { color: grays.black },
      transitionDuration: 100,
      borderColor: grays['300'],
      borderWidth: 1,
      formatter: function(params) {
        return `<strong>${params.data.name}:</strong> ${params.percent}%`;
      }
    },
    position(pos, params, dom, rect, size) {
      return getPosition(pos, params, dom, rect, size);
    },
    legend: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['100%', '87%'],
        avoidLabelOverlap: true,
        hoverAnimation: false,
        itemStyle: {
          borderWidth: 2,
          borderColor: isDark ? '#0E1C2F' : '#fff'
        },
        label: {normal : {show: false} },
        labelLine: { normal: { show: false } },
        data: data
      }
    ]
  };
};



const Balances = ({ dsaAddress }) => {
 
  const { isDark, currency } = useContext(AppContext);
  const {balances, setBalances, initBalances } = useContext(BalancesDataContext);
  const [total, setTotal]=useState({usd:0, eth:0});

  const [collapsed, setCollapsed] = useState(true);

 const updateTotal = async () => {      
    let totalEth=0;
    let totalUSD=0;
    // console.log(balances);
    for(const bal of balances) { 
      totalEth+=bal.eth;
      totalUSD+=bal.usd;
    } 
    setTotal({usd:totalUSD, eth:totalEth});
    // console.log(total);
  }
  useEffect(() => {
    setBalances([]);
    setTotal({usd:0,eth:0});
    initBalances(dsaAddress);
  }, [dsaAddress]);

  useEffect(() => {
    if(balances.length===0) {
      initBalances(dsaAddress);
    }
  }, [balances.length, total.usd]);

  useEffect(() => {
    if(balances.length!==0)
      updateTotal();
  },[balances.length, total.usd])

  return (
    <Card className="dsa-page-lg-row-1">
      <FalconCardHeader className="pb-0" title="Balances" light={false} titleTag="h6" />
      <CardBody tag={Flex} align="start">
        <Row className="flex-grow-1" tag={Flex} align="end">
          <Col className="align-self-center">
            <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
              {currency+' '+numberFormatter(total.usd, 2)}
            </div>
            <Badge pill color="soft-info" className="fs--2">
            <img src={ethIcon} alt="eth-icon" style={{width:'20px'}}/>
              <span className="mx-2">{numberFormatter(total.eth, 2)}</span>
            </Badge>
          </Col>
          <Col xs="auto" className="pl-0" id="bals-breakup-chart">
              <ReactEchartsCore
                echarts={echarts}
                option={getOption(balances, isDark)}
                style={{ width: '6.625rem', height: '6.625rem'}}
              />
          </Col>
          {/* <div className="card-collapsible-btn-div">    
          <Button color="link" block onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'view' : 'less'}
          <FontAwesomeIcon icon="chevron-up" className="ml-1 fs--2" transform={collapsed ? 'rotate-180' : ''} />
        </Button>
      </div>  */}
        </Row> 

      </CardBody>
      <Collapse isOpen={!collapsed}>
      <CardFooter id="bal-total-card-footer">
      {isIterableArray(balances) && balances.map(balance =>
        <div className="fs--1" key={balance.token} style={{marginBottom:'10px'}}>
          <BalanceItem 
            {...balance}
            totalUSD={total.usd}
          />
        </div>
      )}
      </CardFooter>
      </Collapse>
    </Card>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default Balances;
