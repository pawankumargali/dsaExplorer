import React, { useState, useEffect, Fragment, useContext } from 'react';
// import PurchasesTable from './PurchasesTable';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, CustomInput, Button, Card, CardBody } from 'reactstrap';
// import RecentTxsDataProvider from './RecentTxsDataProvider';
// import RecentTxsDataProvider from './RecentTxsDataProvider';
import ButtonIcon from '../common/ButtonIcon';
import { Link } from 'react-router-dom';
import SearchBox from '../dashboard-alt/SearchBox';
import BalancesBreakupTable from './BalancesBreakupTable';
import BalancesDataProvider from  './BalancesDataProvider';
import { BalancesDataContext } from '../../context/Context';


const BalancesBreakup = ({dsaAddress}) => {
  
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 10;
  const [tokenSearchText, setTokenSearchText] = useState('');
  const [hideBalBreakup, setHideBalBreakup] = useState(false);

  return (
    <Fragment>
    {!hideBalBreakup && 
    <Card className="dsa-page-lg-row-2">
      <FalconCardHeader title="Balances Breakup" titleTag="h6" light={false}>
      {totalSize>10 && 
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
        <BalancesDataProvider>
            <BalancesBreakupTable 
            pageSize={pageSize}
            totalSize={totalSize}
            searchText={tokenSearchText}
            setTotalSize={setTotalSize}
            dsaAddress={dsaAddress}
            setHideBalBreakup = {setHideBalBreakup}
            />
        </BalancesDataProvider>
      </CardBody>
 
    </Card>
    }
    </Fragment>
  );
};

export default BalancesBreakup;