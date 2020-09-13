import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Col, Row } from 'reactstrap';
import { PositionsContext } from '../../context/Context';
import { getTokenPriceInUSD, getEthPriceInUSD } from '../../coinExPrices';
import tokens from '../../tokens';
import Asset from './Asset';
import Net from './Net';
import Status from './Status';
import MakerVault from './MakerVault';
import TokenSupplyBorrowDetails from './TokenSupplyBorrowDetails';


const DetailedPosition = ({ dsaAddress }) => {

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

    
     { areValsSet &&
     <Row noGutters className="mb-1"> 
      <TokenSupplyBorrowDetails 
        position={position}
        currentAsset={currentAsset}
        currentVault={currentMakerVault}
        values={values}
      />
    </Row>
    }

    </Fragment>

  );
};


export default DetailedPosition;
