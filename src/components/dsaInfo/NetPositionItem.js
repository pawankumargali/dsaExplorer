import React, { useContext, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext, PositionsContext } from '../../context/Context';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';

import ethIcon from '../../assets/img/tokens/eth.svg';
import tokens from '../../tokens';
import StorageStatus from './StorageStatus';
import compoundIcon from '../../assets/img/defi/compound.svg';
import aaveIcon from '../../assets/img/defi/aave.svg';
import makerIcon from '../../assets/img/defi/maker.svg';
import dydxIcon from '../../assets/img/defi/dydx.png';

const NetPositionItem = ({ name, dsaAddress }) => {
  const { isDark, currency } = useContext(AppContext);

  const { positions, arePositionsReceived, initPositions } = useContext(PositionsContext);
  const [total, setTotal]=useState({
    supply: {eth:0, usd:0},
    borrow: {eth:0, usd:0}
  });
  const [isTotalSet, setIsTotalSet] = useState(false);
  const [progressBarVals, setProgressBarVals] = useState([]);
  const [areValsSet, setAreValsSet] = useState(false);

  const [isSafe, setIsSafe] = useState(true);
  const defiIcons = {
    compound: compoundIcon,
    aave: aaveIcon,
    maker: makerIcon,
    dydx: dydxIcon
  }

  const updateTotal = async () => {   
    const ethPriceInUSD = await getEthPriceInUSD();
    const { totalSupplyInEth, totalBorrowInEth } = positions[name];
    const totalUpdate = { 
        supply: {eth: totalSupplyInEth, usd: totalSupplyInEth*ethPriceInUSD },
        borrow: {eth: totalBorrowInEth, usd: totalBorrowInEth*ethPriceInUSD }
    };
    setTotal(totalUpdate);
    setIsTotalSet(true);
  }

  const updateProgressBar = () => {
      // console.log(total);
      const progress=[];
      progress.push({ name:'Supply', size:total.supply.usd, sizeInEth:total.supply.eth, color:'success' });
      progress.push({ name:'Borrorw', size:total.borrow.usd, sizeInEth:total.borrow.eth, color:'warning' });
      setProgressBarVals(progress);
      setAreValsSet(true);
  };

  const updateIsAssetSafe = () => {
    const { totalBorrowInEth ,totalSupplyInEth, liquidation } = positions[name];
    const safe = totalBorrowInEth/totalSupplyInEth >= liquidation ? false : true;
    setIsSafe(safe);
  }

  const runInit = async () => {
    if(!arePositionsReceived)
      await initPositions(dsaAddress);
    else {
      await updateTotal();
      updateProgressBar();
      updateIsAssetSafe();
      setAreValsSet(true);
    }
  }

  useEffect(() => {
    if(!arePositionsReceived)
      initPositions(dsaAddress);
  }, [arePositionsReceived]);

  useEffect(() => {
    if(arePositionsReceived) {
        updateTotal();
        updateIsAssetSafe();
    }
  }, [arePositionsReceived]);

  useEffect(() => {
    if(isTotalSet)
      updateProgressBar();
  }, [isTotalSet, areValsSet]);

    return ( 

      <Row className="flex-grow-1" tag={Flex} align="center" justify="start" style={{padding:'5px',marginBottom:'5px'}}>
       <div className="mx-1 pl-2 pr-2 align-self-center" style={{width:'145px'}}>
          <img src={defiIcons[name]} alt="eth-icon" style={{width:'32px', marginRight:'10px'}}/>
          <span className="font-weight-semi-bold">{name==='dydx' ? 'dYdX' : name.substring(0,1).toUpperCase()+name.substring(1)}</span>
      </div>
      <div className="mx-1 pl-2 pr-2 align-self-center">
        <div className="font-weight-semi-bold text-sans-serif">
          {currency+' '+numberFormatter(total.supply.usd-total.borrow.usd, 2)}
        </div>
        <Badge pill color="soft-info">
          <img src={ethIcon} alt="eth-icon" style={{width:'12px', marginRight:'5px'}}/>
          <span style={{fontSize:'12px', lineHeight:'14px'}}>{numberFormatter(total.supply.eth-total.borrow.eth, 2)}</span>
        </Badge>
      </div>
      <div className="mx-1 pl-2 pr-2 align-self-center" style={{position:'relative', top:'0.4rem'}}>
        {total.supply.usd!==0 ?
        (<StorageStatus 
            data={progressBarVals}
            height={25}
            width={200}
        />):
          <div style={{width:'200px'}}></div>
        }
      </div>
      {total.supply.usd!==0 && arePositionsReceived &&
      <Fragment>
        <div className="mx-1 align-self-center" style={{position:'relative', top:'-0.2rem'}}>
        <Badge color="soft-info">
          C.F
          <span className="mx-1 align-self-center" style={{fontSize:'0.8rem'}} style={isSafe ? {color:'#00D27A'}:{color:'red'}}>
            {Math.round((total.borrow.usd/total.supply.usd)*100)+'%'}
          </span>
        </Badge>
      </div>
      <div className="mx-1 align-self-center" style={{position:'relative', top:'-0.2rem'}}>
        <Badge color="soft-info">
          Max
          <span className="mx-1" style={{fontSize:'0.8rem'}} style={{color:'#F5803E'}}>
            {Math.round(positions[name].liquidation*100)+'%'}
          </span>
        </Badge>
      </div>
      </Fragment>
      }

    </Row>
  )

};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default NetPositionItem;
