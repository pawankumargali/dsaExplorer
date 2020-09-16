import React, { useState, useEffect, Fragment, useContext } from 'react';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, Card, CardBody } from 'reactstrap';
import SearchBox from '../dashboard/SearchBox';
import BalancesBreakupTable from './BalancesBreakupTable';
import { BalancesDataContext } from '../../context/Context';


const BalancesBreakup = ({dsaAddress}) => {
  
  const { balances, initBalances } = useContext(BalancesDataContext);
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 8;
  const [tokenSearchText, setTokenSearchText] = useState('');

  useEffect(() => {
    initBalances(dsaAddress);
  }, [dsaAddress]);
  
  useEffect(() => {
    if(balances.length===0) 
      initBalances(dsaAddress);
  },[balances.length]);

  return (
    <Fragment>
    {balances.length!==0 && 
    <Card className="dsa-page-lg-row-2">
      <FalconCardHeader title="Balances Breakup" titleTag="h6" light={false}>
      {balances.length>pageSize && 
        <InputGroup size="sm" className="input-group input-group-sm mt-3">
            <SearchBox 
              icon="filter" 
              idName="all-balances-search-form" 
              placeholder="Filter tokens"
              searchText={tokenSearchText}
              setSearchText={setTokenSearchText}
              onSubmitHandler={e => e.preventDefault()}
            />
          </InputGroup>
      }
      </FalconCardHeader>
      <CardBody className="p-0 pb-3">
            <BalancesBreakupTable 
            pageSize={pageSize}
            totalSize={totalSize}
            searchText={tokenSearchText}
            setTotalSize={setTotalSize}
            dsaAddress={dsaAddress}
            balances={balances}
            />
      </CardBody>
    </Card>
    }
    </Fragment>
  );
};

export default BalancesBreakup;