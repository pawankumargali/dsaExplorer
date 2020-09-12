import React, { Fragment, createRef, useState, useEffect, useContext } from 'react';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import Badge from 'reactstrap/es/Badge';
import { Button, Col, Row } from 'reactstrap';
import ButtonIcon from '../common/ButtonIcon';
import { isIterableArray } from '../../helpers/utils';
import { themeColors } from '../../helpers/utils';
import AppContext, { BalancesDataContext } from '../../context/Context';
import axios from 'axios';
import { getBalances, getAuthorizedAddresses } from '../../dsaInterface';
import { numberFormatter } from '../../helpers/utils';
import tokens from '../../tokens';




const CustomTotal = ({ sizePerPage, totalSize, page, lastIndex }) =>  {
  if(totalSize===0) 
    return (<span>
            No matches
          </span>);
  return (<span>
          {(page - 1) * sizePerPage + 1} to {lastIndex > totalSize ? totalSize : lastIndex} of {totalSize} 
        </span>);
}

const addressFormatter = ownerAddress => (
  <a href={`https://etherscan.io/address/${ownerAddress}`} 
    className="font-weight-semi-bold"
    target="_blank"
    rel="noopener noreferrer"
  > 
    {ownerAddress.substring(0,20)+'...'}
  </a>
);

const colorDotFormatter = colorCode => (
    <div style={{width:'10px', height:'10px', backgroundColor:colorCode, borderRadius:'50%'}}></div>
)

const tokenNameFormatter = token => (
    <div>
        <img src={tokens[token].icon} alt="eth-icon" style={{width:'20px', marginRight:'10px'}}/>
        <span style={{lineHeight:'25px', fontWeight:'600'}}>{tokens[token].name}</span>
    </div>
    
)
const tokenAmtFormatter = tokenAmt => (
    <span>{tokenAmt < 0.001 ? numberFormatter(tokenAmt,6) : numberFormatter(tokenAmt,2)}</span>
)

const tokenAmtInUSDFormatter = tokenAmt => (
    <span>{'$'+(tokenAmt < 0.001 ? numberFormatter(tokenAmt,6) : numberFormatter(tokenAmt,2)) }</span>
    

)

const tokenAmtInEthFormatter = tokenAmt => (
    <div>
        <img src={tokens['eth'].icon} alt="eth-icon" style={{width:'12px', marginRight:'5px'}}/>
        <span>{tokenAmt < 0.001 ? numberFormatter(tokenAmt,6) : numberFormatter(tokenAmt,2)}</span>
    </div>
)

const tokenAmtPercentageFormatter = tokenPercent => (
    <Badge pill color="soft-info" className="fs--2 d-lg-block font-weight-semi-bold"> 
        {numberFormatter(tokenPercent*100,0)+' %'} 
      </Badge>
)



const columns = [
  {
    dataField: 'color',
    text: 'Color Dot',
    headerAttrs: { hidden: true },
    formatter: colorDotFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false
  },
  {
    dataField: 'token',
    text: 'Token',
    headerAttrs: { hidden: true },
    formatter: tokenNameFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false
  },
   {
    dataField: 'amt',
    text: 'Amount',
    headerAttrs: { hidden: true },
    formatter: tokenAmtFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false
  },
  {
   dataField: 'usd',
   text: 'Amt in USD',
   headerAttrs: { hidden: true },
   formatter: tokenAmtInUSDFormatter,
   classes: 'border-0 align-middle',
   headerClasses: 'border-0',
   sort: false
 },
 {
    dataField: 'eth',
    text: 'Amt in Eth',
    headerAttrs: { hidden: true },
    formatter: tokenAmtInEthFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false
  },
 {
  dataField: 'percentage',
  text: 'Percentage',
  headerAttrs: { hidden: true },
  formatter: tokenAmtPercentageFormatter,
  classes: 'border-0 align-middle',
  headerClasses: 'border-0',
  sort: false
 }
];

const BalancesBreakupTable = ({ pageSize, totalSize, searchText, setTotalSize, dsaAddress, setHideBalBreakup }) => {


  const { isDark } = useContext(AppContext);
  const { balances, setBalances, initBalances } = useContext(BalancesDataContext);
  const [displayBalances, setDisplayBalances] = useState([]);
  const [areDisplayBalsSet, setAreDisplayBalsSet] = useState(false);
  
  // Pagination options
  const [options, setOptions] = useState({custom:true, sizePerPage:pageSize, totalSize});
  
  useEffect(() => {
    setBalances([]);
    setDisplayBalances([]);
    setAreDisplayBalsSet(false);
    initBalances(dsaAddress);
  }, [dsaAddress]);

  useEffect(() => {
    if(balances.length===0) 
      initBalances(dsaAddress);
  },[balances.length]);


  // updates the owners to be displayed based on search filter text
  const updateDisplayBalances = () => {
      if(searchText==="") {
        setDisplayBalances(balances);
        setTotalSize(balances.length);
        if(balances.length!==0) 
          setAreDisplayBalsSet(true);
      }
      else {
        const balsToDisplay=[];
        for(const bal of balances) {
          if(bal.name.toLowerCase().includes(searchText.toLowerCase()) || bal.token.includes(searchText.toLowerCase()) )
            balsToDisplay.push(bal);
        }
        setDisplayBalances(balsToDisplay);
        setTotalSize(balsToDisplay.length);
        if(balances.length!==0)
          setAreDisplayBalsSet(true);
        // console.log(balsToDisplay);
      }
      const options = {custom:true, sizePerPage:pageSize, totalSize};
      setOptions(options);
     
  };
  

  useEffect(() => {
      if(balances.length!==0 && (!areDisplayBalsSet || searchText!=='')) 
        updateDisplayBalances();
  }, [balances.length, areDisplayBalsSet, searchText, totalSize]);



  let table = createRef();

  const handlePrevPage = ({ page, onPageChange }) => () => {
    onPageChange(page - 1);
  };

  const handleNextPage = ({ page, onPageChange }) => () => {
    onPageChange(page + 1);
  };



  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {({ paginationProps, paginationTableProps }) => {
        const lastIndex = paginationProps.page * paginationProps.sizePerPage;

        return (
          <Fragment>
            <div className="table-responsive">
              <BootstrapTable
                ref={table}
                bootstrap4
                keyField="token"
                data={displayBalances}
                columns={columns}
                bordered={false}
                classes="table-dashboard table-sm fs--1 border-bottom border-200 mb-0 table-dashboard-th-nowrap"
                rowClasses="btn-reveal-trigger border-top border-200"
                headerClasses="bg-200 text-900 border-y border-200"
                {...paginationTableProps}
              />
            </div>
            {totalSize>10 && 
            <Row noGutters className="px-1 py-3">
              <Col className="pl-3 fs--1">
                <CustomTotal {...paginationProps} lastIndex={lastIndex} />
              </Col>
              <Col xs="auto" className="pr-3">
                <ButtonIcon
                  color={paginationProps.page === 1 ?'light' : null}
                  size="xs"
                  icon="chevron-left"
                  onClick={handlePrevPage(paginationProps)}
                  disabled={paginationProps.page===1}
                  className="pagination-page-num-btn font-weight-800"
                  style={{fontWeight:600}}
                >
                  
                </ButtonIcon>
                
                <ButtonIcon
                  icon="chevron-right"
                  color={lastIndex >= paginationProps.totalSize ? 'light': null}
                  size="xs"
                  onClick={handleNextPage(paginationProps)}
                  disabled={lastIndex >= paginationProps.totalSize}
                  className="pagination-page-num-btn font-weight-800"
                  style={{fontWeight:600}}
                >
                </ButtonIcon> 
              </Col>
            </Row>
            }
          </Fragment>
        );
    }}
    </PaginationProvider>
  );
};

export default BalancesBreakupTable;