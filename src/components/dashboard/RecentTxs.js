import React, { useState, Fragment } from 'react';
import RecentTxsTable from './RecentTxsTable';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, CustomInput, Card, CardBody } from 'reactstrap';
import RecentTxsDataProvider from './RecentTxsDataProvider';
import ButtonIcon from '../common/ButtonIcon';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';


const RecentTxs = ({isPreview}) => {
  
  const [totalSize, setTotalSize] = useState(100);
  const [ pageSize, setPageSize ] = useState(10);
  const [pageNums, setPageNums] = useState([1,2,3,4,5,6,7,8,9,10]);
  const [txSearchText, setTxSearchText] = useState('');


  const handlePageSizeChange = e => { 
    const size =  e.target.value;
    const maxPageNum = totalSize/size;
    const pageNumbers=[];
    for(let i=1; i<=maxPageNum; i++) {
      pageNumbers.push(i);
    }
    setPageSize(size);
    setPageNums(pageNumbers);
    console.log(e.target.value);
  }

  const showRecordsInlineStyle = {
    fontSize:'14px',
    color:"#7793BE",
    padding:'3px',
  };

  return (
    <Card className={isPreview ? "" : "my-4"}>
      <FalconCardHeader  
        title={
          <Fragment>
            Recent 
            <span className="d-none d-sm-inline"> Transactions</span>
            <span className="d-inline d-sm-none"> Txs</span>
          </Fragment>
        }
        titleTag="h5" 
        light={false}>
        <InputGroup size="sm" className="input-group input-group-sm">

            {isPreview ? 
            (<Link to='/txs'>
              <ButtonIcon
              color="link"
              size="sm"
              icon="chevron-right"
              iconAlign="right"
              transform="down-1 shrink-4"
              className="px-0 font-weight-semi-bold"
              >
              Explore
              </ButtonIcon>
            </Link>):
            (<Fragment>
            <SearchBox 
              icon="filter" 
              idName="all-txs-search-form" 
              placeholder="Filter txns"
              searchText={txSearchText}
              setSearchText={setTxSearchText}
              onSubmitHandler={e => e.preventDefault()}
            />
            <span className="font-weight-semi-bold mr-1 d-none d-sm-block" style={showRecordsInlineStyle}>Show</span>
            <CustomInput 
              type="select" 
              id="bulk-select"
              value={pageSize}
              onChange={handlePageSizeChange}
            >     
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value={totalSize}>All</option>
            </CustomInput>
            <span className="font-weight-semi-bold ml-1 d-none d-sm-block" style={showRecordsInlineStyle}>records</span>
            </Fragment>)}
          </InputGroup>
      </FalconCardHeader>
      <CardBody className="p-0">
      <RecentTxsDataProvider>
        <RecentTxsTable 
          pageSize={pageSize}
          totalSize={totalSize}
          pageNums={pageNums}
          txSearchText={txSearchText}
          setTotalSize={setTotalSize}
        />
      </RecentTxsDataProvider>        
      </CardBody>
 
    </Card>
  );
};

export default RecentTxs;
