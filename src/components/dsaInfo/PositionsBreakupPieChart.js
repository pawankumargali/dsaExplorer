import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import Flex from '../common/Flex';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { getPosition, getGrays } from '../../helpers/utils';
import AppContext, { PositionsContext } from '../../context/Context';

import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import FalconCardHeader from '../common/FalconCardHeader';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import tokens from '../../tokens';


const getOption = (data, isDark) => {
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
        radius: ['100%', '0%'],
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


const PositionsBreakupPieChart = ({ positions, arePositionsSet, getTotalMakerColAndDebtInUSD }) => {
  const { isDark } = useContext(AppContext);

  const [isChartUpdated, setIsChartUpdated] = useState(false);

  const names= ['Maker', 'Compound', 'Aave', 'dYdX'];
  const colors=['#2c7be5','#27bcfd', '#39F3BB', '#999','#d8e2ef'];

  const [values, setValues] = useState([]);

  const tokenPricesInUSD={};
  const updateChart = async () => {
    // Values are pushed in order above => Maker, Compound, Aave, dYdX
    // console.log(positions);
    const vals=[];
    const { maker } = positions;
    const [makerColInUSD, makerDebtInUSD] = await getTotalMakerColAndDebtInUSD(maker);
    if(!isNaN(makerColInUSD) && makerColInUSD!==0) {
      const value = makerColInUSD-makerDebtInUSD;
      vals.push({name:'Maker', value});
    }
    if(!tokenPricesInUSD['eth']) tokenPricesInUSD['eth'] = await getEthPriceInUSD();
    for(const asset in positions) {
      if(asset==='maker') continue;
      const { totalSupplyInEth, totalBorrowInEth } = positions[asset];
      if(!isNaN(totalSupplyInEth) && totalSupplyInEth!==0) {
        const supplyInUSD = totalSupplyInEth*tokenPricesInUSD['eth'];
        const borrowInUSD = totalBorrowInEth*tokenPricesInUSD['eth'];
        const name = asset.substring(0,1).toUpperCase()+asset.substring(1);
        const value = supplyInUSD-borrowInUSD;
        vals.push({name, value});
      }
    }

    let colorIndex=0;
    for(let val of vals) {
      val.color = colors[colorIndex];
      colorIndex+=1;
    }
    setValues([...vals]);
    // console.log(vals);
    setIsChartUpdated(true);
  }

  useEffect(() => {
    if(arePositionsSet) 
      updateChart();
  },[arePositionsSet, isChartUpdated])

  return (
        <ReactEchartsCore
        echarts={echarts}
        option={getOption(values, isDark)}
        style={{ width: '4rem', height: '4rem'}}
        />
  );
};

// TopProducts.propTypes = {
//   data: PropTypes.array.isRequired,
//   colors: PropTypes.arrayOf(PropTypes.string).isRequired,
//   className: PropTypes.string
// };

export default PositionsBreakupPieChart;
