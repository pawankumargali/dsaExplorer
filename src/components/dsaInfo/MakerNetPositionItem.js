import React, { useContext, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter, CustomInput, InputGroup } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter, isIterableArray } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext, PositionsContext } from '../../context/Context';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import ethIcon from '../../assets/img/tokens/eth.svg';
import tokens from '../../tokens';
import StorageStatus from './SupplyBorrowStatus';
import compoundIcon from '../../assets/img/defi/compound.svg';
import aaveIcon from '../../assets/img/defi/aave.svg';
import makerIcon from '../../assets/img/defi/maker.svg';
import dydxIcon from '../../assets/img/defi/dydx.png';

const MakerNetPositionItem = ({ dsaAddress }) => {
  const { isDark, currency } = useContext(AppContext);

  const { positions, arePositionsReceived, initPositions } = useContext(PositionsContext);
  const [vaults, setVaults] = useState([]);
  const [total, setTotal]=useState({});
  const [isTotalSet, setIsTotalSet] = useState(false);
  const [progressBarVals, setProgressBarVals] = useState([]);
  const [areValsSet, setAreValsSet] = useState(false);
  const [vaultId, setVaultId] = useState('');
  const [isSafe, setIsSafe] = useState({});
  const defiIcons = {
    compound: compoundIcon,
    aave: aaveIcon,
    maker: makerIcon,
    dydx: dydxIcon
  }

 const pricesInUSD = {};

  const updateTotal = async () => {  
    if(!pricesInUSD['eth']) pricesInUSD['eth'] = await getEthPriceInUSD();
    if(!pricesInUSD['dai']) pricesInUSD['dai'] = await getTokenPriceInUSD(tokens['dai'].address);
   
    const totalUpdate={};
    
    for(const vaultId of vaults) {
        totalUpdate[vaultId] = {
          col: {eth:0, usd:0},
          debt: {eth:0, usd:0}
        };
    }
    for(const vaultId in totalUpdate) {
      let {col, debt, token} = positions['maker'][vaultId];
      token=token.toLowerCase();
      col = isNaN(col) ? 0 : col;
      if(!pricesInUSD[token]) await getTokenPriceInUSD(tokens[token].address);
      const colInEth = (token==='eth') ? col : col*(pricesInUSD[token]/pricesInUSD['eth']);
      const debtInEth = debt*(pricesInUSD['dai']/pricesInUSD['eth']);
      totalUpdate[vaultId]['col']['eth'] =colInEth;
      totalUpdate[vaultId]['col']['usd']=colInEth*pricesInUSD['eth'];
      totalUpdate[vaultId]['debt']['eth']=debtInEth;
      totalUpdate[vaultId]['debt']['usd']= debtInEth*pricesInUSD['eth'];
    }
    setTotal(totalUpdate);
    setIsTotalSet(true);
    // console.log(totalUpdate);
  }

  const updateProgressBar = () => {
      const progress=[];
      progress.push({ name:'Supply', size:total[vaultId].col.usd, sizeInEth:total[vaultId].col.eth, color:'success' });
      progress.push({ name:'Borrow', size:total[vaultId].debt.usd, sizeInEth:total[vaultId].debt.eth, color:'warning' });
      setProgressBarVals(progress);
      setAreValsSet(true);
  };

  const updateIsAssetSafe = () => {;
    const { col, debt } = total[vaultId];
    const { liquidation } = positions['maker'][vaultId];
    // console.log(liquidation);
    const safe = col.eth/debt.eth >= liquidation ? false : true;
    setIsSafe(true);
  }


  useEffect(() => {
    if(!arePositionsReceived)
      initPositions(dsaAddress);
      
  },[arePositionsReceived]);

  useEffect(() => {
    if(arePositionsReceived) {
      const vaults = Object.keys(positions['maker']);
      setVaults(vaults);
      if(vaultId==='')
        setVaultId(vaults[0]);
    }
  }, [arePositionsReceived, vaultId]);

  useEffect(() => {
    if(vaults.length!==0)
      updateTotal();
  },[vaultId])

  useEffect(() => {
    if(isTotalSet) {
      updateProgressBar();
      updateIsAssetSafe();
    }
  },[vaultId, isTotalSet, areValsSet])


  const handleVaultChange = e =>  setVaultId(e.target.value);

    return ( 
  <Row className="flex-grow-1" tag={Flex} align="center" justify="start" style={{padding:'5px',marginBottom:'5px'}}>
       <div className="mx-1 pl-2 pr-2 align-self-center" style={{width:'145px'}}>
          <img src={defiIcons['maker']} alt="eth-icon" style={{width:'32px', marginRight:'10px'}}/>
          <span className="font-weight-semi-bold">Maker</span>
          <InputGroup size="sm" className="input-group input-group-sm">
            <CustomInput 
              type="select" 
              id="bulk-select"
              value={vaultId}
              onChange={handleVaultChange}
            > 
            {vaults.length!==0 && isIterableArray(vaults) && vaults.map(vaultNo =>
              <option key={vaultNo} value={vaultNo}>{vaultNo}</option>
            )}
            </CustomInput>
            </InputGroup>
      </div>
      {isTotalSet && vaultId!=='' &&
      <Fragment>
      <div className="mx-1 pl-2 pr-2 align-self-center">
        <div className="font-weight-semi-bold text-sans-serif">
          {currency+' '+numberFormatter(total[vaultId].col.usd-total[vaultId].debt.usd, 2)}
        </div>
        <Badge pill color="soft-info">
          <img src={ethIcon} alt="eth-icon" style={{width:'12px', marginRight:'5px'}}/>
          <span style={{fontSize:'12px', lineHeight:'14px'}}>{numberFormatter(total[vaultId].col.eth-total[vaultId].debt.eth, 2)}</span>
        </Badge>
      </div>
      <div className="mx-1 pl-2 pr-2 align-self-center" style={{position:'relative', top:'0.4rem'}}>
        {total[vaultId].col.usd!==0 ?
        (<StorageStatus 
            data={progressBarVals}
            height={25}
            width={200}
        />):
          <div style={{width:'200px'}}></div>
        }
      </div>
      {total[vaultId].col.usd!==0 &&
        <Fragment>
        <div className="mx-1 align-self-center" style={{position:'relative', top:'-0.4rem'}}>
        <Badge color="soft-info">
          C.F
          <span className="mx-1 align-self-center" style={{fontSize:'0.8rem'}} style={isSafe ? {color:'#00D27A'}:{color:'red'}}>
            {Math.round((total[vaultId].debt.usd/total[vaultId].col.usd)*100)+' %'}
          </span>
        </Badge>
      </div>
      <div className="mx-1 align-self-center" style={{position:'relative', top:'-0.4rem'}}>
        <Badge color="soft-info">
          Max
          <span className="mx-1 align-self-center" style={{fontSize:'0.8rem'}} style={{color:'#F5803E'}}>
            {Math.round(positions['maker'][vaultId].liquidation*100)+'%'}
          </span>
        </Badge>
      </div>
      </Fragment>}
      </Fragment>}
    </Row>
  )
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default MakerNetPositionItem;


