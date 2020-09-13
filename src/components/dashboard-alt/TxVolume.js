import React, { Fragment, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap';
import FalconCardHeader from '../common/FalconCardHeader';
import Flex from '../common/Flex';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import { themeColors, getPosition, numberFormatter, getGrays } from '../../helpers/utils';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import AppContext, { TxVolDataContext } from '../../context/Context';

import axios from 'axios';
import ethIcon from '../../assets/img/tokens/eth.svg';

const getFormatter= (params) => {
    let {name, value} = params[1]
    if(name==='oneInch') name='1inch';
    return `${name} : $${numberFormatter(value,0)}`;
}

const getOption = (xValues, yValues, dataBackground, isDark) => {
  const grays = getGrays(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      padding: [7, 10],
      // formatter: '{b1}:{c1}',
      formatter(params) {
        return getFormatter(params);
      },
      backgroundColor: grays.white,
      borderColor: grays['300'],
      borderWidth: 1,
      textStyle: { color: themeColors.dark },
      transitionDuration: 0,
      position(pos, params, dom, rect, size) {
        return getPosition(pos, params, dom, rect, size);
      }
    },
    xAxis: {
      type: 'category',
      data: xValues,
      boundaryGap: false,
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisPointer: { type: 'none' }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisPointer: { type: 'none' }
    },
    series: [
      {
        type: 'bar',
        barWidth: '5px',
        barGap: '-100%',
        itemStyle: {
          color: grays['200'],
          barBorderRadius: 10
        },
        data: dataBackground,
        animation: true,
        emphasis: { itemStyle: { color: grays['200'] } }
      },
      {
        type: 'bar',
        barWidth: '5px',
        itemStyle: {
          color: themeColors.primary,
          barBorderRadius: 10
        },
        data: yValues,
        emphasis: { itemStyle: { color: themeColors.primary } },
        z: 10
      }
    ],
    grid: { right: 5, left: 10, top: 0, bottom: 0 }
  };
};

const TxVolume = () => {

  const { currency, isDark } = useContext(AppContext);

  const {txVolData, setTxVolData, IsTxVolDataReceived, setIsTxVolDataReceived} = useContext(TxVolDataContext);

  const [xValues,setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalEth, setTotalEth] = useState(0);
  const [areValsSet, setAreValsSet] = useState(false);
  // Max value of data
  const [dataBackground, setDataBackground] = useState([]);

  const getTxVolData = async () => {
    try {
      if(Object.keys(txVolData).length===0) {
        const txVolUrl = 'https://dsa-info.herokuapp.com/api/dsa/tx/volume?key=Er2wUbHQ8hYADskWFk9JQntnf';
        const response = await axios.get(txVolUrl);
        const { data } = response.data;
        setTxVolData(data);
        setIsTxVolDataReceived(true);
        return data;
      }
      else return txVolData;
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateChart = txVolData => {
      const { curveSbtc, curveSusd, curveY } = txVolData;
      const data = {};
      let totalUSD = 0;
      let totalEth = 0;
      const curveTotalUSD = curveSbtc.usd + curveSusd.usd + curveY.usd;
      const curveTotalEth = curveSbtc.eth + curveSusd.eth + curveY.eth;
      data['curve']=curveTotalUSD;
      totalUSD+=curveTotalUSD;
      totalEth+=curveTotalEth;
      for(const dex in txVolData) {
        if(dex=='curveSbtc' || dex=='curveSusd' || dex=='curveY') continue;
        totalUSD+=txVolData[dex].usd;
        totalEth+=txVolData[dex].eth;
        data[dex]=txVolData[dex].usd;
      }
      const xVals = Object.keys(data).sort((key1, key2) => data[key2]-data[key1]);
      const yVals=[];
      const colors = ['#2c7be5','#27bcfd', '#39F3BB', '#999','#d8e2ef'];
      let colorIndex=0;
      for(const dex of xVals) {
        yVals.push({value:data[dex], itemStyle:{color:colors[colorIndex]} });
        colorIndex+=1;
      }
      const valuesArray=[];
      for(const val of yVals) {
        valuesArray.push(val.value);
      }
      const yMax = Math.max(...valuesArray);
      const background = valuesArray.map(() => yMax);
      setXValues(xVals);
      setYValues(yVals);
      setDataBackground(background);
      setTotalUSD(totalUSD);
      setTotalEth(totalEth);
      setAreValsSet(true);
  }

  useEffect(() => {
    getTxVolData().then(volData => updateChart(volData))
  }, [IsTxVolDataReceived, areValsSet]);


  return (
    <Card className="h-md-100" id="total-tx-vol-card">
      <CardBody tag={Flex} align="end">
        <Row className="h-100 flex-grow-1" >
          <Col>
            <h6 className="mt-1 pb-0 mb-4">Past 24hr Transaction Volume</h6>
            <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
              {currency}
              <span className="mx-2">{numberFormatter(totalUSD, 2)}</span>
            </div>
            <Badge pill color="soft-success" className="fs--1 mt-2">
              <img src={ethIcon} alt="eth-icon" style={{width:'20px'}}/>
              <span className="mx-2">{numberFormatter(totalEth, 2)}</span>
            </Badge>
          </Col>
          <Col xs="auto" className="pl-0" id="total-tx-vol-chart">
            <ReactEchartsCore
              echarts={echarts}
              option={getOption(xValues, yValues, dataBackground, isDark)}
              style={{ width: '6.25rem', height: '100%' }}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};


export default TxVolume;
