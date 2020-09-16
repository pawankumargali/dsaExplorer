import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, Card, CardBody } from 'reactstrap';
import SearchBox from '../dashboard/SearchBox';
import OwnersTable from './OwnersTable';
import { getAuthorizedAddresses } from '../../helpers/dsaInterface';


const Owners = ({dsaAddress , sizeId}) => {
  
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 4;
  const [ownersSearchText, setOwnersSearchText] = useState('');

  const [owners, setOwners] = useState([]);
 
  // fetches data and updates owners
  const updateOwners = async () => {
    try {
      const data = await getAuthorizedAddresses(dsaAddress);
      // console.log(data);
      const ownrs = [];
      data.forEach((owner, index) => ownrs.push({id:index, address:owner}));
      setOwners(ownrs);
      setTotalSize(ownrs.length);
    }
    catch(err) {
      console.log(err);
    }
  }
  
  useEffect(() => {
    if(owners.length===0)
      updateOwners();
  },[owners.length]);

  return (
    <Card className="dsa-page-lg-row-1">
      <FalconCardHeader title="Owners" titleTag="h6" light={false} >
      {owners.length>pageSize && 
        <InputGroup size="sm" className="input-group input-group-sm mt-3">
            <SearchBox 
              icon="filter" 
              idName={`all-owners-search-form-${sizeId}`}
              placeholder="Filter Owners"
              searchText={ownersSearchText}
              setSearchText={setOwnersSearchText}
              onSubmitHandler={e => e.preventDefault()}
            />
          </InputGroup>
      }
      </FalconCardHeader>
      <CardBody className="p-0 pb-3">
        <OwnersTable 
          pageSize={pageSize}
          totalSize={totalSize}
          owners={owners}
          searchText={ownersSearchText}
          setTotalSize={setTotalSize}
        />      
      </CardBody>
 
    </Card>
  );
};

Owners.propTypes = { dsaAddress: PropTypes.string.isRequired };

export default Owners;