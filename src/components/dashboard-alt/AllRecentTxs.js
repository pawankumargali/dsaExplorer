import React, { useState } from 'react';
import PurchasesTable from './PurchasesTable';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, CustomInput, Button, Card, CardBody } from 'reactstrap';
import RecentTxsDataProvider from './RecentTxDataProvider';
import ButtonIcon from '../common/ButtonIcon';
import { Link } from 'react-router-dom';


const AllRecentTxs = () => {
  const [ pageSize, setPageSize ] = useState(100);
  const [pageNums, setPageNums] = useState([1]);
  const totalSize=100;
  const handlesizePerPageChange = e => { 
    const size = e.target.value;
    const maxPageNum = totalSize/size;
    const pageNumbers=[];
    for(let i=1; i<=maxPageNum; i++) {
      pageNumbers.push(i);
    }
    setPageSize(e.target.value);
    setPageNums(pageNumbers);
  }
  const showRecordsInlineStyle = {
    fontSize:'14px',
    color:"#7793BE",
    padding:'3px',
  };

  return (
    <Card className="my-4">
      <FalconCardHeader title="Recent Transactions" titleTag="h5" light={false}>
        <InputGroup size="sm" className="input-group input-group-sm">
            <span className="font-weight-semi-bold mr-1" style={showRecordsInlineStyle}>Show </span>
            <CustomInput 
              type="select" 
              id="bulk-select"
              value={pageSize}
              onChange={handlesizePerPageChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value={totalSize}>All</option>
            </CustomInput>
            <span className="font-weight-semi-bold ml-1" style={showRecordsInlineStyle}>records</span>
          </InputGroup>
      </FalconCardHeader>
      <CardBody className="p-0">
      <RecentTxsDataProvider>
        <PurchasesTable 
          pageSize={pageSize}
          pageNums={pageNums}
          totalSize={totalSize}
          isAllRecentTxsPage={true}
        />
      </RecentTxsDataProvider>        
      </CardBody>
 
    </Card>
  );
};

export default AllRecentTxs;
