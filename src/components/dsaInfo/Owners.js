import React, { useState, useEffect, Fragment } from 'react';
// import PurchasesTable from './PurchasesTable';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, CustomInput, Button, Card, CardBody } from 'reactstrap';
// import RecentTxsDataProvider from './RecentTxsDataProvider';
// import RecentTxsDataProvider from './RecentTxsDataProvider';
import ButtonIcon from '../common/ButtonIcon';
import { Link } from 'react-router-dom';
import SearchBox from '../dashboard-alt/SearchBox';
import OwnersTable from './OwnersTable';


const Owners = ({dsaAddress}) => {
  
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 5;
  const [ownerSearchText, setOwnerSearchText] = useState('');

  return (
    <Card className="dsa-page-lg-row-1">
      <FalconCardHeader title="Owners" titleTag="h6" light={false}>
      {totalSize>5 && 
        <InputGroup size="sm" className="input-group input-group-sm mt-3">
            <SearchBox 
              icon="filter" 
              idName="all-owners-search-form" 
              placeholder="Filter owners"
              searchText={ownerSearchText}
              setSearchText={setOwnerSearchText}
              onSubmitHandler={e => e.preventDefault()}
            />
          </InputGroup>
      }
      </FalconCardHeader>
      <CardBody className="p-0 pb-3">
        <OwnersTable 
          pageSize={pageSize}
          totalSize={totalSize}
          searchText={ownerSearchText}
          setTotalSize={setTotalSize}
          dsaAddress={dsaAddress}
        />      
      </CardBody>
 
    </Card>
  );
};

export default Owners;