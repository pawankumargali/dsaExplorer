import React, { useContext, useState, useEffect, Fragment } from 'react';
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

import PositionsBreakupBarChart from './PositionsBreakupBarChart';
import PositionsBreakupPieChart from './PositionsBreakupPieChart';


const PositionsChart = ({ className, dsaAddress }) => {

  const { positions, arePositionsReceived, setArePositionsReceived, initPositions } = useContext(PositionsContext);
  const [arePositionsSet, setArePositionsSet] = useState(false);
  const tokenPricesInUSD={};
  const _getTotalMakerColAndDebtInUSD = async makerPos => {
    let totalColInUSD=0;
    let totalDebtInUSD=0;
    if(!tokenPricesInUSD['eth']) tokenPricesInUSD['eth'] = await getEthPriceInUSD();
    if(!tokenPricesInUSD['dai']) tokenPricesInUSD['dai'] = await getTokenPriceInUSD(tokens['dai'].address);
    const ethPriceInUSD = tokenPricesInUSD['eth'];
    const daiPriceInUSD = tokenPricesInUSD['dai'];
    for(const vaultId in makerPos) {
      if(typeof Number(vaultId)!=="number") continue;
        let {col, token, debt} = makerPos[vaultId];
        col = isNaN(col) ? 0 : col;
        token = token.toLowerCase();
        if(!tokenPricesInUSD[token]) tokenPricesInUSD[token] = await getTokenPriceInUSD(tokens[token].address)
        const colInUSD = token==='eth' ? (col*ethPriceInUSD) : (col*tokenPricesInUSD[token]);
        const debtInUSD = debt*daiPriceInUSD;
        totalColInUSD+=colInUSD;
        totalDebtInUSD+=debtInUSD;
    }
    return [totalColInUSD, totalDebtInUSD];
 }

  useEffect(() => {
    setArePositionsReceived(false);
    setArePositionsSet(false);
  }, [dsaAddress]);

  useEffect(() => {
    if(!arePositionsReceived)
      initPositions(dsaAddress);
  },[arePositionsReceived]);

  useEffect(() => {
    if(arePositionsReceived) {
      const {compound, aave, maker, dydx} = positions;
      if(!!compound && !!aave && !!maker && !!dydx) 
        setArePositionsSet(true);
    }
  }, [arePositionsReceived, arePositionsSet]);

  return (
    <Fragment>
    { arePositionsSet && 
    <Card className="dsa-page-lg-row-2">
       <FalconCardHeader className="pb-0" title="Positions Breakup" light={false} titleTag="h6"></FalconCardHeader>
      <CardBody className="h-100" style={{position:'relative'}}>
        
          <div style={{position:'absolute', top:'-15px', right:'10px'}}>
          <PositionsBreakupPieChart 
              positions={positions}
              arePositionsSet={arePositionsSet}
              getTotalMakerColAndDebtInUSD={_getTotalMakerColAndDebtInUSD}
          />
        </div>
          <PositionsBreakupBarChart 
            positions={positions}
            arePositionsSet={arePositionsSet}
            getTotalMakerColAndDebtInUSD={_getTotalMakerColAndDebtInUSD}
          />
      </CardBody>
    </Card>}
    </Fragment>
  );
};

// TopProducts.propTypes = {
//   data: PropTypes.array.isRequired,
//   colors: PropTypes.arrayOf(PropTypes.string).isRequired,
//   className: PropTypes.string
// };

export default PositionsChart;
