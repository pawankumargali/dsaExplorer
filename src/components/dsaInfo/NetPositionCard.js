import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter, isIterableArray, themeColors, getPosition, getGrays, colors } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext, PositionsContext } from '../../context/Context';
import { getCompoundPosition, getMakerPosition, getAavePosition, getDydxPosition } from '../../dsaInterface';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ethIcon from '../../assets/img/tokens/eth.svg';
import tokens from '../../tokens';
// import OverallNetPosition from './OverallNetPosition';
// import NetPositionItem from './NetPositionItem';
import StorageStatus from './StorageStatus';
import StorageStatusDot from './StorageStatusDot';
// import MakerNetPositionItem from './MakerNetPositionItem';
import PositionsDataProvider from './PositionsDataProvider';

const positionNames = ['compound','aave','maker','dydx'];
const storageStatusDotColors = [
        {
            name: 'Supply',
            color: 'success',
            size:0
        },
        {
            name: 'Borrow',
            color: 'warning',
            size:0
        },

    ];

const NetPositionCard = ({ dsaAddress }) => {
  console.log(dsaAddress);

  const { isDark, currency } = useContext(AppContext);
    // const { address: dsaAddress } = match.params;
  const { positions, arePositionsReceived, setArePositionsReceived, initPositions } = useContext(PositionsContext);
  const [total, setTotal]=useState({
      supply:{ eth:0, usd:0 }, 
      borrow:{ eth:0, usd:0 }
    });
  const [isTotalSet, setIsTotalSet] = useState(false);

  const [progressBarVals, setProgressBarVals] = useState([]);
  const [areValsSet, setAreValsSet] = useState(false);

  useEffect(() => {
    setArePositionsReceived(false);
    setIsTotalSet(false);
    setAreValsSet(false);
  }, [dsaAddress]);

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

  // const [collapsed, setCollapsed] = useState(true);

    

  return (
    <Card className="dsa-page-lg-row-1">
      <FalconCardHeader className="pb-0" title="Net Position" light={false} titleTag="h6">
        <Row className="fs--1 font-weight-semi-bold">
        {storageStatusDotColors.map((d, index) => (
            <StorageStatusDot {...d} isFirst={index === 0} isLast={storageStatusDotColors.length - 1 === index} key={index} />
        ))}
        </Row>
      </FalconCardHeader>
      <CardBody tag={Flex} align="center">
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
          {/* <PositionsDataProvider>
            <OverallNetPosition 
              dsaAddress={dsaAddress}    
            />
          </PositionsDataProvider> */}
          {/* {isPreview &&
          <div className="card-collapsible-btn-div">    
              <Button color="link" block onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? 'view' : 'less'}
              <FontAwesomeIcon icon="chevron-up" className="ml-1 fs--2" transform={collapsed ? 'rotate-180' : ''} />
              </Button>
          </div>} */}
      </CardBody>


      {/* <Collapse isOpen={!collapsed}>
      <CardFooter id="net-position-card-footer">
        <PositionsDataProvider>
          <MakerNetPositionItem 
            key={'maker'}
            dsaAddress={dsaAddress}
          />
          {positionNames.filter(pos => pos!=='maker').map(pos =>   
              <NetPositionItem
                key={pos}
                dsaAddress={dsaAddress}
                name={pos}
              />
          )}
        </PositionsDataProvider>
      </CardFooter>
      </Collapse> */}
    </Card>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default NetPositionCard;
