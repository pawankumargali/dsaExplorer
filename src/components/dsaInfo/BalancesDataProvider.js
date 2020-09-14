import React, { useState } from 'react';
import { getBalances } from '../../helpers/dsaInterface';
import { getSupportedTokenPricesInUSD } from '../../helpers/coinExPrices';
import { BalancesDataContext } from '../../context/Context';
import tokens from '../../helpers/tokens';

const BalancesProvider = ({ children }) => {

  const [balances, setBalances] = useState([]);
  const colors=['#2c7be5','#27bcfd', '#39F3BB', '#999','#d8e2ef'];

  const initBalances = async dsaAddress => {      
    const balData = await getBalances(dsaAddress);
    // console.log(balData);
    const bals=[];
    const tokenPricesInUSD = await getSupportedTokenPricesInUSD();
    const tokenPricesInEth = {};
    tokenPricesInEth['eth'] = 1;
    for(const token in tokenPricesInUSD) {
      if(token!=='eth') 
        tokenPricesInEth[token]=tokenPricesInUSD[token]/tokenPricesInUSD['eth'];
    }
    
    let colorIndex=0;
    let totalInUSD=0;
    for(const token in balData) {
        if(balData[token]!==0) {
          const valInEth=balData[token]*tokenPricesInEth[token];
          const valInUSD = balData[token]*tokenPricesInUSD[token];
          totalInUSD+=valInUSD;
          bals.push({ token, name:tokens[token].name, amt: balData[token], usd:valInUSD, eth:valInEth, color:colors[colorIndex]});
          colorIndex+=1;
        } 
    }
    for(const bal of bals) {
      bal['percentage'] = totalInUSD===0 ? 0 : (bal.usd/totalInUSD);
    }
    // console.log(bals);
    bals.sort((token1, token2) => token2.usd-token1.usd);
    setBalances(bals);
 }
  
  return (<BalancesDataContext.Provider value={{ balances, setBalances, initBalances }}>
              {children}
         </BalancesDataContext.Provider>);
}

export default BalancesProvider;