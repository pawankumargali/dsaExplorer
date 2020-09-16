import React, { useContext, useState, useEffect } from 'react';
import FalconCardHeader from '../common/FalconCardHeader';
import PropTypes from 'prop-types';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter } from '../../helpers/utils';
import AppContext, { PositionsContext } from '../../context/Context';
import { getTokenPriceInUSD, getEthPriceInUSD } from '../../helpers/coinExPrices';
import tokens from '../../helpers/tokens';
import SupplyBorrowStatus from './SupplyBorrowStatus';
import SupplyBorrowStatusDot from './SupplyBorrowStatusDot';

const NetPositionCard = ({ dsaAddress }) => {
  // console.log(dsaAddress);

  const { isDark, currency } = useContext(AppContext);

  const colors = {
    supply: isDark ? 'secondary':'success',
    borrow: isDark ? 'danger' : 'warning'
  }
  const supplyBorrowStatusDotColors = [
    {
        name: 'Supply',
        color: colors['supply'],
        size:0
    },
    {
        name: 'Borrow',
        color: colors['borrow'],
        size:0
    },
  
  ];



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
    // console.log(compound, aave, dydx, maker);
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
    progress.push({ name:'Supply', size:total.supply.usd,  color: colors['supply'] });
    progress.push({ name:'Borrorw', size:total.borrow.usd, color: colors['borrow'] });
    setProgressBarVals(progress);
    setAreValsSet(true);
  };

  // const [collapsed, setCollapsed] = useState(true);

    

  return (
    <Card className="dsa-page-lg-row-1">
      <FalconCardHeader className="pb-0" title="Net Position" light={false} titleTag="h6">
        <Row className="fs--1 font-weight-semi-bold">
        {supplyBorrowStatusDotColors.map((d, index) => (
            <SupplyBorrowStatusDot {...d} isFirst={index === 0} isLast={supplyBorrowStatusDotColors.length - 1 === index} key={index} />
        ))}
        </Row>
      </FalconCardHeader>
      <CardBody tag={Flex} align="center">
      <Row className="flex-grow-1" tag={Flex} align="end">
        <Col className="align-self-center">
          <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1"
            style={{minWidth:'172px'}}
          >
            {currency+' '+numberFormatter(total.supply.usd-total.borrow.usd, 2)}
          </div>
          <Badge pill color="soft-info" className="fs--2">
          <img src={tokens['eth'].icon} alt="eth-icon" style={{width:'20px'}}/>
            <span className="mx-2">{numberFormatter(total.supply.eth-total.borrow.eth, 2)}</span>
          </Badge>
        </Col>
        <Col sm="auto" >
          <SupplyBorrowStatus 
              data={progressBarVals}
              height={30}
              width={300}
              className="supply-borrow-status-col"
          />
        </Col>
      </Row>
      </CardBody>
    </Card>
  );
};

NetPositionCard.propTypes = { dsaAddress: PropTypes.string.isRequired };

export default NetPositionCard;
