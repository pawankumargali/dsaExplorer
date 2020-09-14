import React, { useContext, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import { PositionsContext } from '../../context/Context';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import FalconCardHeader from '../common/FalconCardHeader';
import { getTokenPriceInUSD, getEthPriceInUSD } from '../../helpers/coinExPrices';
import tokens from '../../helpers/tokens';
import PositionsBreakupBarChart from './PositionsBreakupBarChart';
import PositionsBreakupPieChart from './PositionsBreakupPieChart';


const PositionsBreakupChart = ({ dsaAddress }) => {

  const { positions, arePositionsReceived, setArePositionsReceived, initPositions } = useContext(PositionsContext);
  const [arePositionsSet, setArePositionsSet] = useState(false);
  const [hasNoPosition, setHasNoPosition] = useState(false);
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
    initPositions(dsaAddress);
    setHasNoPosition(false);
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
  }, [arePositionsReceived]);

  return (
    <Fragment>
    { arePositionsSet && !hasNoPosition &&
    <Card className="dsa-page-lg-row-2">
       <FalconCardHeader className="pb-0" title="Positions Breakup" light={false} titleTag="h6"></FalconCardHeader>
      <CardBody className="h-100" style={{position:'relative'}}>
        
          <div style={{position:'absolute', top:'-15px', right:'10px'}}>
          <PositionsBreakupPieChart 
              positions={positions}
              arePositionsSet={arePositionsSet}
              getTotalMakerColAndDebtInUSD={_getTotalMakerColAndDebtInUSD}
              setHasNoPosition={setHasNoPosition}
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

PositionsBreakupChart.propTypes = {
  dsaAddress: PropTypes.string.isRequired
};

export default PositionsBreakupChart;
