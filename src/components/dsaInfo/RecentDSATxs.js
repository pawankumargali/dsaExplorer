import React, { useState, useEffect, Fragment } from 'react';
import RecentDSATxsTable from './RecentDSATxsTable';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, CustomInput, Button, Card, CardBody } from 'reactstrap';
// import RecentTxsDataProvider from './RecentTxsDataProvider';
// import RecentTxsDataProvider from './RecentTxsDataProvider';
import ButtonIcon from '../common/ButtonIcon';
import { Link } from 'react-router-dom';
import SearchBox from '../dashboard-alt/SearchBox';


const RecentDSATxs = ({ dsaAddress }) => {
  
  const [totalSize, setTotalSize] = useState(10);
  const pageSize = 10;
  const [txSearchText, setTxSearchText] = useState('');

  return (
    <Card className="my-2">
      <FalconCardHeader title="Recent Transactions" titleTag="h5" light={false}>
        <InputGroup size="sm" className="input-group input-group-sm">
            <SearchBox 
              icon="filter" 
              idName="dsa-txs-search-form" 
              placeholder="Filter txns"
              searchText={txSearchText}
              setSearchText={setTxSearchText}
              onSubmitHandler={e => e.preventDefault()}
            />
          </InputGroup>
      </FalconCardHeader>
      <CardBody className="p-0">
        <RecentDSATxsTable
          pageSize={pageSize}
          totalSize={totalSize}
          setTotalSize={setTotalSize}
          txSearchText={txSearchText}
          dsaAddress={dsaAddress}
        />    
      </CardBody>
 
    </Card>
  );
};

export default RecentDSATxs;
