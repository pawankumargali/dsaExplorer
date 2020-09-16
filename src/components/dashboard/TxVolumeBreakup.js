import React, { useState, useEffect } from 'react';
import { getGrays, getPosition, isIterableArray, numberFormatter } from '../../helpers/utils';
import TxVolBreakupItem from './TxVolBreakupItem';
import { Card, CardBody, Col, Row } from 'reactstrap';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/chart/pie';
import { useContext } from 'react';
import AppContext, { TxVolDataContext } from '../../context/Context';
import { colors } from '../../helpers/utils';
// import { backgroundColor } from 'echarts/lib/theme/dark';

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
        radius: ['100%', '89%'],
        avoidLabelOverlap: true,
        hoverAnimation: false,
        itemStyle: {
          borderWidth: 2,
          borderColor: isDark ? '#0E1C2F' : '#fff'
        },
        labelLine: { normal: { show: false } },
        data: data
      }
    ]
  };
};

const TxVolumeBreakup = () => {

  const { currency } = useContext(AppContext);
  const { txVolData, IsTxVolDataReceived } = useContext(TxVolDataContext);
 
  const [values, setValues] = useState([]);
  const [areValsSet, setAreValsSet] = useState(false);
  const [total, setTotal] = useState({usd:0, eth:0});
  const [isTotalSet, setIsTotalSet] = useState(false);

  const updateValues = () => {
    
      let totalUSD=0;
      let totalEth=0;
      const vals=[];
      const { curveSbtc, curveSusd, curveY } = txVolData;
      const curveTotalUSD = curveSbtc.usd + curveSusd.usd + curveY.usd;
      const curveTotalEth = curveSbtc.eth + curveSusd.eth + curveY.eth;
      totalUSD+=curveTotalUSD;
      totalEth+=curveTotalEth;
      vals.push({name:'curve', usd: curveTotalUSD, eth: curveTotalEth});
      for(const dex in txVolData) {
        if(dex=='curveSbtc' || dex=='curveSusd' || dex=='curveY') continue;
          const usd = txVolData[dex].usd;
          const eth = txVolData[dex].eth;
          totalUSD+=usd;
          totalEth+=eth;
        if(dex==='oneInch') vals.push({name:'1inch', usd, eth });
        else vals.push({name:dex, usd, eth});
        
      }
      vals.sort((a, b) => b.usd-a.usd);

      let colorIndex=0;
      for(let val of vals) {
        val.color = colors[colorIndex];
        colorIndex+=1;
      }
      // console.log(vals);
      setValues(vals);
      setAreValsSet(true);
      const total = {usd: totalUSD, eth: totalEth};
      setTotal(total);
      setIsTotalSet(true);    
  }

  useEffect(() => {
    if(IsTxVolDataReceived) 
      updateValues();
  },[IsTxVolDataReceived, areValsSet, isTotalSet]);
  
  const { isDark } = useContext(AppContext);

  return (
    <Card className="h-md-100">
      <CardBody>
        <Row noGutters className="h-100 justify-content-between">
          <Col xs={5} sm={6} className="col-xxl pr-2">
            <h6 className="mt-1 mb-4" style={{minWidth:'200px'}}>Transaction Volume Breakup</h6>
            <div className="fs--1">
              {isIterableArray(values) &&
                values.map(({...rest }, index) => <TxVolBreakupItem
                                                    {...rest} 
                                                    totalUSD={total.usd} 
                                                    key={index} 
                                                  />)}
            </div>
          </Col>
          <Col xs="auto" className="pl-0" id="tx-vol-breakup-chart-col">
            <div className="position-relative">
              <ReactEchartsCore
                echarts={echarts}
                option={getOption(values, isDark)}
                style={{ width: '6.625rem', height: '6.625rem'}}
              />
              <div className="absolute-centered font-weight-medium text-dark fs-2">
                {currency + numberFormatter(total.usd, 2)}
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};


export default TxVolumeBreakup;
