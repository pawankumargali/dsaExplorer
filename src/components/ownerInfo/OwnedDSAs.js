import React, { useState  } from 'react';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, Card, CardBody } from 'reactstrap';
import SearchBox from '../dashboard/SearchBox';
import OwnedDSAsTable from './OwnedDSAsTable';


const OwnedDSAs = ({ownerAddress, currentDsa, setCurrentDsa}) => {
  
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 10;
  const [dsaSearchText, setDsaSearchText] = useState('');

  return (
    <Card>
      <FalconCardHeader title="DSAs" titleTag="h5" light={false}>
      {totalSize>10 && 
        <InputGroup size="sm" className="input-group input-group-sm mt-3">
            <SearchBox 
              icon="filter" 
              idName="all-dsa-search-form" 
              placeholder="Filter DSAs"
              searchText={dsaSearchText}
              setSearchText={setDsaSearchText}
              onSubmitHandler={e => e.preventDefault()}
            />
          </InputGroup>
      }
      </FalconCardHeader>
      <CardBody className="p-0 pb-3">
        <OwnedDSAsTable 
          pageSize={pageSize}
          totalSize={totalSize}
          searchText={dsaSearchText}
          setTotalSize={setTotalSize}
          ownerAddress={ownerAddress}
          currentDsa={currentDsa}
          setCurrentDsa={setCurrentDsa}

        />      
      </CardBody>
 
    </Card>
  );
};

export default OwnedDSAs;