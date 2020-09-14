import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, Card, CardBody } from 'reactstrap';
import SearchBox from '../dashboard/SearchBox';
import OwnersTable from './OwnersTable';


const Owners = ({dsaAddress}) => {
  
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 4;
  const [ownerSearchText, setOwnerSearchText] = useState('');

  return (
    <Card className="dsa-page-lg-row-1">
      <FalconCardHeader title="Owners" titleTag="h6" light={false}>
      {totalSize>10 && 
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

Owners.propTypes = { dsaAddress: PropTypes.string.isRequired };

export default Owners;