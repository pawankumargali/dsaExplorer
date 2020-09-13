import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter, isIterableArray, themeColors, getPosition, getGrays, colors } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext, PositionsContext } from '../../context/Context';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ethIcon from '../../assets/img/tokens/eth.svg';
import tokens from '../../tokens';
import NetPositionItem from './NetPositionItem';
import StorageStatus from './SupplyBorrowStatus';
import StorageStatusDot from './SupplyBorrowStatusDot';
import { update } from 'lodash';


const OverallNetPosition = ({ dsaAddress }) => {
  const { isDark, currency } = useContext(AppContext);
  const { positions, arePositionsReceived, initPositions, setPositions, setArePositionsReceived } = useContext(PositionsContext);
  const [total, setTotal]=useState({
      supply:{ eth:0, usd:0 }, 
      borrow:{ eth:0, usd:0 }
    });
  const [isTotalSet, setIsTotalSet] = useState(false);

  const [progressBarVals, setProgressBarVals] = useState([]);
  const [areValsSet, setAreValsSet] = useState(false);


  useEffect(() => {
    if(!arePositionsReceived)
      initPositions(dsaAddress);
  }, [arePositionsReceived]);

  useEffect(() => {
    if(arePositionsReceived)
      updateTotal();
  }, [arePositionsReceived, isTotalSet, areValsSet]);

  useEffect(() => {
    if(isTotalSet)
      updateProgressBar();
  },[isTotalSet, areValsSet])

  const tokenPricesInUSD = {};

  const updateTotal  = async () => {
    const {compound, aave, dydx, maker} = positions;
    let totalSupplyInEth=0;
    let totalBorrowInEth=0;
    const [makerColInEth, makerDebtInEth] = await _getTotalMakerColAndDebtInEth(maker);
    totalSupplyInEth= makerColInEth+compound.totalSupplyInEth+aave.totalSupplyInEth+dydx.totalSupplyInEth;
    totalBorrowInEth+= makerDebtInEth+compound.totalBorrowInEth+aave.totalBorrowInEth+dydx.totalBorrowInEth;
    if(!tokenPricesInUSD['eth']) tokenPricesInUSD['eth'] = await getEthPriceInUSD();
    const ethPriceInUSD = tokenPricesInUSD['eth'];
    const totalUpdate = { 
        supply: {eth: totalSupplyInEth, usd: totalSupplyInEth*ethPriceInUSD },
        borrow: {eth: totalBorrowInEth, usd: totalBorrowInEth*ethPriceInUSD }
    };
    setTotal(totalUpdate);
    setIsTotalSet(true);
  }


 const _getTotalMakerColAndDebtInEth = async makerPos => {
    let totalColInEth=0;
    let totalDebtInEth=0;
    if(!tokenPricesInUSD['eth']) tokenPricesInUSD['eth'] = await getEthPriceInUSD();
    const ethPriceInUSD = tokenPricesInUSD['eth'];
    if(!tokenPricesInUSD['dai']) tokenPricesInUSD['dai'] = await getTokenPriceInUSD(tokens['dai'].address);
    const daiPriceInEth = tokenPricesInUSD['dai']/ethPriceInUSD;
    for(const vaultId in makerPos) {
      if(typeof Number(vaultId)!=="number") continue;
        let {col, token, debt} = makerPos[vaultId];
        col = isNaN(col) ? 0 : col;
        token = token.toLowerCase();
        if(!tokenPricesInUSD[token]) tokenPricesInUSD[token] = await getTokenPriceInUSD(tokens[token].address);
        const colInEth = token==='eth' ? col : (col*(tokenPricesInUSD[token])/ethPriceInUSD);
        const debtInEth = debt*daiPriceInEth;
        totalColInEth+=colInEth;
        totalDebtInEth+=debtInEth;
    }
    return [totalColInEth, totalDebtInEth];
 }


  const updateProgressBar = () => {
    const progress=[];
    progress.push({ name:'Supply', size:total.supply.usd, sizeInEth:total.supply.eth, color: 'success' });
    progress.push({ name:'Borrorw', size:total.borrow.usd, sizeInEth:total.borrow.eth, color:'warning' });
    setProgressBarVals(progress);
    setAreValsSet(true);
  };


  return (
    <Row className="flex-grow-1" tag={Flex} align="end">
        <Col className="align-self-center">
          <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
            {currency+' '+numberFormatter(total.supply.usd-total.borrow.usd, 2)}
          </div>
          <Badge pill color="soft-info" className="fs--2">
          <img src={ethIcon} alt="eth-icon" style={{width:'20px'}}/>
            <span className="mx-2">{numberFormatter(total.supply.eth-total.borrow.eth, 2)}</span>
          </Badge>
        </Col>
        <Col xs="auto" className="pl-0" id="bals-breakup-chart">
          <StorageStatus 
              data={progressBarVals}
              height={30}
              width={300}
          />
        </Col>
    </Row>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default OverallNetPosition;
