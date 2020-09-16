import React, { useState, useEffect  } from 'react';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, Card, CardBody } from 'reactstrap';
import SearchBox from '../dashboard/SearchBox';
import OwnedDSAsTable from './OwnedDSAsTable';
import { getAccounts } from '../../helpers/dsaInterface';


const OwnedDSAs = ({ownerAddress, currentDsa, setCurrentDsa}) => {
  
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 10;
  const [dsaSearchText, setDsaSearchText] = useState('');

  const [dsas, setDsas] = useState([]);
  // fetches data and updates owners
  const updateDSAs = async () => {
    try {
      const data = await getAccounts(ownerAddress);
      // console.log(data);
      if(currentDsa==='')
        setCurrentDsa(data[0].address);   
      const addresses = [];
      data.forEach(({id, address}) => {
          addresses.push({id, address});
      });
      setDsas(addresses);
    }
    catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
      updateDSAs();
  },[dsas.length, currentDsa]);

  return (
    <Card>
      <FalconCardHeader title="DSAs" titleTag="h5" light={false} >
      {dsas.length>pageSize && 
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
          dsas={dsas}
          currentDsa={currentDsa}
          setCurrentDsa={setCurrentDsa}
        />      
      </CardBody>
 
    </Card>
  );
};

export default OwnedDSAs;