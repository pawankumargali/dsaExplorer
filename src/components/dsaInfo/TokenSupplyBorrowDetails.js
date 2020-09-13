import React, { useContext, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter, isIterableArray, themeColors, getPosition, getGrays, colors } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext } from '../../context/Context';
import { getBalances } from '../../dsaInterface';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ethIcon from '../../assets/img/tokens/eth.svg';
import tokens from '../../tokens';
import BalanceItem from './BalanceItem';

import TokenSupplyBorrowTable from './TokenSupplyBorrowTable';



const TokenSupplyBorrowDetails = ({ position, currentAsset, currentVault }) => {
  
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 10;
  const [tokenDetails, setTokenDetails] = useState([]);
  const labels = {
    'maker': { supply:'Collateral', borrow:'Debt'},
    'compound':{supply:'Lent', borrow:'Borrowed'},
    'aave':{supply:'Lent', borrow:'Borrowed'},
    'dydx':{supply:'Lent', borrow:'Borrowed'},
  };

  const tokenPricesInUSD={};
  const updateTokenDetails = async () => {
    const details=[];
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
        details.push({token, label:labels[currentAsset].supply, value:col, usd:colInUSD});
        details.push({token:'dai', label:labels[currentAsset].borrow, value: debt, usd: debtInUSD})
      }
      // console.log(details);
      setTokenDetails(details);
      setTotalSize(details.length);
    }
    else {
      console.log(position);
      for(const token in position) {
        if(!position[token].supply && !position[token].borrow) continue;
        let {supply, borrow, supplyYield, borrowYield} = position[token];
        console.log(position[token]);
        supply = isNaN(supply) ? 0 : supply;
        borrow = isNaN(borrow) ? 0 : borrow;
        if(!tokenPricesInUSD[token]) 
          tokenPricesInUSD[token] = token==='eth' ? (await getEthPriceInUSD()) :  (await getTokenPriceInUSD(tokens[token].address));
       
        if(supply!==0) {
          const supplyInUSD = supply*tokenPricesInUSD[token];
          const val = { token, label:labels[currentAsset].supply, value:supply, usd: supplyInUSD, rate:{percentage:supplyYield, color:'soft-success'}};
          details.push(val);
        }
        if(borrow!==0) {
          const borrowInUSD = borrow*tokenPricesInUSD[token];
          const val = { token, label:labels[currentAsset].borrow, value: borrow, usd:borrowInUSD, rate:{percentage:borrowYield, color:'soft-warning'}};
          details.push(val);
        }
      }
      // console.log(details);
      setTokenDetails(details);
      setTotalSize(details.length);
    }
  }

  useEffect(() => {
    if(tokenDetails.length===0)
        updateTokenDetails();
  },[currentAsset, currentVault]);

  return (
    <Card>
      <CardBody>
            <TokenSupplyBorrowTable 
              tokenDetails={tokenDetails}
            />
      </CardBody>
 
    </Card>
  );
};

export default TokenSupplyBorrowDetails;











// import React, { useContext, useState, useEffect, Fragment } from 'react';
// import PropTypes from 'prop-types';
// import FalconCardHeader from '../common/FalconCardHeader';
// import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
// import Flex from '../common/Flex';
// import { numberFormatter, isIterableArray, themeColors, getPosition, getGrays, colors } from '../../helpers/utils';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import AppContext, { SearchAddressContext } from '../../context/Context';
// import { getBalances } from '../../dsaInterface';
// import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
// import ReactEchartsCore from 'echarts-for-react/lib/core';
// import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/component/tooltip';
// import ethIcon from '../../assets/img/tokens/eth.svg';
// import tokens from '../../tokens';
// import BalanceItem from './BalanceItem';

// import TokenSupplyItem from './TokenSupplyItem';
// import TokenBorrowItem from './TokenBorrowItem';
// import TokenSupplyBorrowTable from './TokenSupplyBorrowTable';


// const TokenSupplyBorrowDetails = ({ position, isPositionSet, currentAsset, currentVault }) => {

//   const { isDark, currency } = useContext(AppContext);
//   const [totalSize, setTotalSize] = useState(0);
//   const pageSize = 10;
  
//   return (
//     <Fragment>
//     {tokenDetails.length!==0 &&
//       <TokenSupplyBorrowTable 
//         pageSize={pageSize}
//         totalSize={totalSize}
//         currentAsset={currentAsset}
//         currentVault={currentVault}
//       />
//     }
//     </Fragment>
    
//   );
// };

// // TotalOrder.propTypes = { data: PropTypes.array.isRequired };

// export default TokenSupplyBorrowDetails;

