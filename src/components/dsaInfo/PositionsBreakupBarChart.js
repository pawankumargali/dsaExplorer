import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import Flex from '../common/Flex';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { getPosition, getGrays, numberFormatter } from '../../helpers/utils';
import AppContext, { PositionsContext } from '../../context/Context';

import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import FalconCardHeader from '../common/FalconCardHeader';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import tokens from '../../tokens';



const getOption = (data, colors, isDark) => {
  const grays = getGrays(isDark);
  return {
    dataset: { source: data },
    tooltip: {
      trigger: 'item',
      padding: [7, 10],
      backgroundColor: grays.white,
      borderColor: grays['300'],
      borderWidth: 1,
      textStyle: { color: grays.dark },
      transitionDuration: 0,
      position(pos, params, dom, rect, size) {
        return getPosition(pos, params, dom, rect, size);
      },
      formatter: function(params) {
        return `<div class="font-weight-semi-bold">${params.seriesName}</div><div class="fs--1 text-600">
        <strong>${params.name}:</strong> ${'$'+numberFormatter(params.value[params.componentIndex + 1],2)}
      </div>`;
      }
    },
    legend: {
      data: data[0].slice(1),
      left: 'left',
      itemWidth: 10,
      itemHeight: 10,
      borderRadius: 0,
      icon: 'circle',
      inactiveColor: grays['500'],
      textStyle: { color: grays['1100'] }
    },
    xAxis: {
      type: 'category',
      axisLabel: { color: grays['400'] },
      axisLine: {
        // lineStyle: {
          // color: grays['300'],
          // type: 'dashed'
        // }
        show:false
      },
      axisTick: false,
      boundaryGap: true
    },
    yAxis: {
      axisPointer: { type: 'none' },
      axisTick: 'none',
      splitLine: {
        // lineStyle: {
        //   // color: grays['white'],
        //   // type: 'dashed'
        // }
        show:false
      },
      axisLine: { show: false },
      axisLabel: { color: grays['400'] }
    },
    series: data[0].slice(1).map((value, index) => ({
      type: 'bar',
      barWidth: '18%',
      barGap: '20%',
      label: { normal: { show: false } },
      z: 10,
      itemStyle: {
        normal: {
          barBorderRadius: [5, 5, 0, 0],
          color: colors[index]
        }
      }
    })),
    grid: { right: '0', left: '30px', bottom: '10%', top: '20%' }
  };
};

const PositionsBreakupBarChart = ({ positions, arePositionsSet, getTotalMakerColAndDebtInUSD }) => {
  const { isDark } = useContext(AppContext);

  const [isChartUpdated, setIsChartUpdated] = useState(false);

  const colors = ['#2C7BE5', '#27BCFD', '#39F3BB', '#999999']

  const [values, setValues] = useState([
    ['Position'],
    ['Net'],
    ['Supply'],
    ['Borrow']
  ]);

  // [ ['Position', 'Maker', 'Compound', 'Aave', 'dYdX'],
  //   ['Net', 0, 0, 0, 0],
  //   ['Supply', 0, 0, 0, 0],
  //   ['Borrow', 0, 0, 0, 0]
  // ]
  const tokenPricesInUSD={};
  const updateChart = async () => {
    // Values are pushed in order above => Maker, Compound, Aave, dYdX
    const vals=[];
    const labels = ['Position'];
    const net = ['Net'];
    const supply = ['Supply'];
    const borrow = ['Borrow'];

    const { maker } = positions;
    const [makerColInUSD, makerDebtInUSD] = await getTotalMakerColAndDebtInUSD(maker);
    if(!isNaN(makerColInUSD) && makerColInUSD!==0) {
      labels.push('Maker');
      net.push(makerColInUSD-makerDebtInUSD);
      supply.push(makerColInUSD);
      borrow.push(makerDebtInUSD);
    }

    if(!tokenPricesInUSD['eth']) tokenPricesInUSD['eth'] = await getEthPriceInUSD();
    for(const asset in positions) {
      if(asset==='maker') continue;
      const { totalSupplyInEth, totalBorrowInEth } = positions[asset];
      if(!isNaN(totalSupplyInEth) && totalSupplyInEth!==0) {
        labels.push(asset.substring(0,1).toUpperCase()+asset.substring(1));
        const supplyInUSD = totalSupplyInEth*tokenPricesInUSD['eth'];
        const borrowInUSD = totalBorrowInEth*tokenPricesInUSD['eth'];
        net.push(supplyInUSD-borrowInUSD);
        supply.push(supplyInUSD);
        borrow.push(borrowInUSD);
      }
    }
    vals.push(labels, net, supply, borrow);
    setValues([...vals]);
    setIsChartUpdated(true);
  }

  useEffect(() => {
    if(arePositionsSet) 
      updateChart();
  },[isChartUpdated])

  return (
        <ReactEchartsCore
          echarts={echarts}
          option={getOption(values, colors, isDark)}
          style={{ minHeight: '18.75rem' }}
        />
  );
};

// TopProducts.propTypes = {
//   data: PropTypes.array.isRequired,
//   colors: PropTypes.arrayOf(PropTypes.string).isRequired,
//   className: PropTypes.string
// };

export default PositionsBreakupBarChart;
