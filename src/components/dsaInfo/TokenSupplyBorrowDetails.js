import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
// import FalconCardHeader from '../common/FalconCardHeader';
import { Card, CardBody, Col } from 'reactstrap';
import { getTokenPriceInUSD, getEthPriceInUSD } from '../../helpers/coinExPrices';
import tokens from '../../helpers/tokens';
import TokenSupplyBorrowTable from './TokenSupplyBorrowTable';



const TokenSupplyBorrowDetails = ({ position, currentAsset, currentVault }) => {
  
  const [tokenDetails, setTokenDetails] = useState([]);
  const [supplyTokens, setSupplyTokens] = useState([]);
  const [borrowTokens, setBorrowTokens] = useState([]);
  const labels = {
    'maker': { supply:'Collateral', borrow:'Debt'},
    'compound':{supply:'Lent', borrow:'Borrowed'},
    'aave':{supply:'Lent', borrow:'Borrowed'},
    'dydx':{supply:'Lent', borrow:'Borrowed'},
  };

  const tokenPricesInUSD={};
  const updateTokenDetails = async () => {
    // const details=[];
    const supplyTkns=[];
    const borrowTkns=[];
    if(currentAsset==='maker') {
      // console.log(position[currentVault])
      let { col, token, debt } = position[currentVault];
      col = isNaN(col) ? 0 : col;
      if(col!==0) {
        token=token.toLowerCase();
        if(!tokenPricesInUSD[token])
          tokenPricesInUSD[token] = token==='eth' ? (await getEthPriceInUSD()) : (await getTokenPriceInUSD(tokens[token].address));
        if(!tokenPricesInUSD['dai']) 
          tokenPricesInUSD['dai'] = await getTokenPriceInUSD(tokens['dai'].address);
        const colInUSD = col*tokenPricesInUSD[token];
        const debtInUSD = debt*tokenPricesInUSD['dai'];
        // details.push({token, label:labels[currentAsset].supply, value:col, usd:colInUSD});
        // details.push({token:'dai', label:labels[currentAsset].borrow, value: debt, usd: debtInUSD})
        supplyTkns.push({token,  value:col, usd:colInUSD});
        borrowTkns.push({token:'dai',  value: debt, usd: debtInUSD})
      }
      // console.log(details);
      // setTokenDetails(details);
      setSupplyTokens(supplyTkns);
      setBorrowTokens(borrowTkns);
    }
    else {
      // console.log(position);
      for(const token in position) {
        if(!position[token].supply && !position[token].borrow) continue;
        let {supply, borrow, supplyYield, borrowYield} = position[token];
        // console.log(position[token]);
        supply = isNaN(supply) ? 0 : supply;
        borrow = isNaN(borrow) ? 0 : borrow;
        if(!tokenPricesInUSD[token]) 
          tokenPricesInUSD[token] = token==='eth' ? (await getEthPriceInUSD()) :  (await getTokenPriceInUSD(tokens[token].address));
       
        if(supply!==0) {
          const supplyInUSD = supply*tokenPricesInUSD[token];
          // const val = { token, label:labels[currentAsset].supply, value:supply, usd: supplyInUSD, rate:{percentage:supplyYield, color:'soft-success'}};
          const val = { token, value:supply, usd: supplyInUSD, rate:{percentage:supplyYield, color:'soft-success'}};
          supplyTkns.push(val);
        }
        if(borrow!==0) {
          const borrowInUSD = borrow*tokenPricesInUSD[token];
          // const val = { token, label:labels[currentAsset].borrow, value: borrow, usd:borrowInUSD, rate:{percentage:borrowYield, color:'soft-warning'}};
          const val = { token, label:labels[currentAsset].borrow, value: borrow, usd:borrowInUSD, rate:{percentage:borrowYield, color:'soft-warning'}};
          borrowTkns.push(val);
        }
      }
      // console.log(details);
      // setTokenDetails(details);
      setSupplyTokens(supplyTkns);
      setBorrowTokens(borrowTkns);
    }
  }

  useEffect(() => {
    if(tokenDetails.length===0)
        updateTokenDetails();
  },[currentAsset, currentVault]);

  return (
    <Fragment>
    {supplyTokens.length!==0 &&
      <Col lg={6} className="col-xxl-3 mb-1 pl-md-2 pr-md-2 mx-auto">
        <h5 className="mt-2 mb-1 pb-0 pl-md-2">{labels[currentAsset].supply}</h5>
      <Card>
        <CardBody>
              <TokenSupplyBorrowTable 
                tokenDetails={supplyTokens}
              />
        </CardBody>
  
      </Card>
      </Col>
    }
    {borrowTokens.length!==0 &&
      <Col lg={6} className="col-xxl-3 mb-1 pl-md-2 pr-md-2 mx-auto">
        <h5 className="mt-2 mb-1 pb-0 pl-md-2">{labels[currentAsset].borrow}</h5>
      <Card>
        <CardBody>
              <TokenSupplyBorrowTable 
                tokenDetails={borrowTokens}
              />
        </CardBody>
  
      </Card>
      </Col>
    }
    </Fragment>
  );
};

export default TokenSupplyBorrowDetails;

