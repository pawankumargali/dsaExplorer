import React, { useContext, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter, CustomInput, InputGroup } from 'reactstrap';
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
import OverallNetPosition from './OverallNetPosition';
import NetPositionItem from './NetPositionItem';
import StorageStatus from './SupplyBorrowStatus';
import StorageStatusDot from './SupplyBorrowStatusDot';
import MakerNetPositionItem from './MakerNetPositionItem';
import PositionsDataProvider from './PositionsDataProvider';



import Asset from './Asset';
import Net from './Net';
import Supply from './Supply';
import Borrow from './Borrow';
import Status from './Status';
import MakerVault from './MakerVault';
import TokenSupplyBorrowDetails from './TokenSupplyBorrowDetails';
// import BorrowDetails from './BorrowDetails';

const DetailedPosition = ({ dsaAddress, isPreview }) => {

  const {positions, arePositionsReceived, initPositions} = useContext(PositionsContext);
  const assets = ['maker','compound','aave','dydx'];
  const [currentAsset, setCurrentAsset] = useState(assets[0]);
  const handleAssetChange = e => {
    setCurrentAsset(e.target.value); 
    setPosition(positions[currentAsset]);
    setIsPositionSet(true);
    setAreValsSet(false);
    if(e.target.value!=='maker')
      setCurrentMakerVault('');
  }

  const [position, setPosition] = useState(null);
  const [isPositionSet, setIsPositionSet] = useState(false);
  const [values, setValues] =useState({
    supply: { usd:0, eth:0 },
    borrow: { usd:0, eth:0 }
  });
  const [areValsSet, setAreValsSet] = useState(false);

  const [makerVaults, setMakerVaults] = useState([]);
  const [currentMakerVault, setCurrentMakerVault] = useState('');
  const [areMakerVaultsSet, setAreMakerVaultsSet] = useState(false);
  const handleVaultChange = e => {
    setCurrentMakerVault(e.target.value);
  }

  const tokenPricesInUSD={};

  const updateMakerVaults = () => {
    const vaults=[];
    for(const vault in positions[currentAsset]) {
      if(isNaN(vault)) continue;
      vaults.push(vault);
    }
    setMakerVaults(vaults);
    if(currentMakerVault==='') setCurrentMakerVault(vaults[0]);
    setAreMakerVaultsSet(true);
    
  }


  const updateValues = async () => {
    const vals = {
      supply: { usd:0, eth:0 },
      borrow: { usd:0, eth:0 }
    }
    if(currentAsset==='maker') {
      // console.log(position[currentMakerVault]);
      if(!tokenPricesInUSD['eth']) tokenPricesInUSD['eth'] = await getEthPriceInUSD();
      if(!tokenPricesInUSD['dai']) tokenPricesInUSD['dai'] = await getTokenPriceInUSD(tokens['dai'].address);
      if(!position[currentMakerVault]) return;
      let {col, token, debt} = position[currentMakerVault];
      if(isNaN(col) || col===0) {
        setValues(vals);
        setAreValsSet(true);
        return;
      }
      token=token.toLowerCase();
      if(!tokenPricesInUSD[token]) await getTokenPriceInUSD(tokens[token].address);
      const colInEth = (token==='eth') ? col : col*(tokenPricesInUSD[token]/tokenPricesInUSD['eth']);
      const debtInEth = debt*(tokenPricesInUSD['dai']/tokenPricesInUSD['eth']);
      vals.supply.eth=colInEth;
      vals.borrow.eth=debtInEth;
      vals.supply.usd = colInEth*tokenPricesInUSD['eth'];
      vals.borrow.usd = debtInEth*tokenPricesInUSD['eth']; 
      setValues(vals);
      setAreValsSet(true);    
    }
    else {
      // console.log(position);
      const { totalSupplyInEth, totalBorrowInEth } = position;
      if(isNaN(totalSupplyInEth) || totalSupplyInEth===0) {
        setValues(vals);
        setAreValsSet(true);
        return;
      }
      if(!tokenPricesInUSD['eth']) tokenPricesInUSD['eth'] = await getEthPriceInUSD();
      vals.supply.eth=totalSupplyInEth;
      vals.borrow.eth=totalBorrowInEth;
      vals.supply.usd = totalSupplyInEth*tokenPricesInUSD['eth'];
      vals.borrow.usd = totalBorrowInEth*tokenPricesInUSD['eth']; 
      // console.log(vals);      
      setValues(vals);
      setAreValsSet(true);
    }
  };



  useEffect(() => {
    if(!arePositionsReceived)
      initPositions(dsaAddress);
  }, [arePositionsReceived]);

  useEffect(() => {
    if(arePositionsReceived) {
      setPosition(positions[currentAsset]);
      setIsPositionSet(true);
    }
  }, [arePositionsReceived, currentAsset, areMakerVaultsSet]);

  useEffect(() => {
    if(isPositionSet && currentAsset!=='maker') updateValues(); 
    else if(isPositionSet && currentAsset==='maker') updateMakerVaults();  
  },[isPositionSet, currentAsset,  areValsSet]);

  useEffect(() => {
    if(areMakerVaultsSet)
      updateValues();
  }, [isPositionSet, currentMakerVault, areMakerVaultsSet])

  
    

  return (
    <Fragment>
    <h5 className="mt-4 mb-1 pb-0 pl-md-2">Detailed Position</h5>
    <Row noGutters className="mt-2 mb-1"> 
      <Col lg={currentAsset==='maker'? 2:3} className="col-xxl-3 mb-2 pl-md-1 pr-md-0">
        <Asset 
          assets={assets}
          currentAsset={currentAsset}
          setCurrentAsset={setCurrentMakerVault}
          handleAssetChange={handleAssetChange}
        />
       
      </Col>

      {currentAsset==='maker' && makerVaults.length!==0 &&
        <Col lg={2} className="col-xxl-3 mb-2 pl-md-2 pr-md-0">
          <MakerVault 
            vaults={makerVaults}
            currentVault={currentMakerVault}
            handleVaultChange={handleVaultChange}
          />
        </Col>
      }
      
      <Col className="col-xxl-3 mb-2 pl-md-2 pr-md-0">
        <Net 
          values={values}
        />
      </Col>

      {areValsSet &&
      <Col lg={3} className="col-xxl-3 mb-2 pl-md-2 pr-md-0">
       <Status 
        position={position}
        values={values}
        currentAsset={currentAsset}
        currentVault={currentMakerVault}
       />
      </Col>
      }
    </Row>

    {/* <h5 className="mt-3 pb-1 pl-md-3">Lend & Borrow Total</h5>
    <Row noGutters lg={12} className="mb-1">
    <Col lg={6} className="col-xxl-3 mb-1 pl-md-3 pr-md-0">
        <Supply 
          values={values}
        />
      </Col>
      <Col lg={6} className="col-xxl-3 mb-1 pl-md-3 pr-md-0">
        <Borrow 
          values={values}
        />
      </Col>
    </Row> */}
    {values.supply.usd!==0 &&
      <h5 className="mt-2 mb-1 pb-0 pl-md-2">Tokens</h5>
    }
     { areValsSet &&
     <Row noGutters className="mb-1"> 
      <Col lg={12} className="col-xxl-3 mb-1 pl-md-2 pr-md-2 mx-auto">
        <TokenSupplyBorrowDetails 
          position={position}
          currentAsset={currentAsset}
          currentVault={currentMakerVault}
        />
      </Col>
    </Row>}

    </Fragment>

  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default DetailedPosition;
