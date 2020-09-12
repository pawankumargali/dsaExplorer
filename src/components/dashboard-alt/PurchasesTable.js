import React, { Fragment, createRef, useState, useEffect, useContext } from 'react';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import Badge from 'reactstrap/es/Badge';
import { Button, Col, Row } from 'reactstrap';
import ButtonIcon from '../common/ButtonIcon';
import { isIterableArray } from '../../helpers/utils';
import { themeColors } from '../../helpers/utils';
import AppContext, { RecentTxsDataContext } from '../../context/Context';
import axios from 'axios';
import ethIcon from '../../assets/img/tokens/eth.svg';

const CustomTotal = ({ sizePerPage, totalSize, page, lastIndex }) =>  {
  if(totalSize===0) 
    return (<span>
            No matches
          </span>);
  return (<span>
          {(page - 1) * sizePerPage + 1} to {lastIndex > totalSize ? totalSize : lastIndex} of {totalSize} 
        </span>);
}

const txHashFormatter = txHash => (
  <a href={`https://etherscan.io/tx/${txHash}`} 
    className="font-weight-semi-bold"
    target="_blank"
    rel="noopener noreferrer"
  > 
    {txHash.substring(0,20)+'...'}
  </a>
);

const blockNumberFormatter = blockNo => (
  <a href={`https://etherscan.io/block/${blockNo}`} 
    className="font-weight-semi-bold"
    target="_blank"
    rel="noopener noreferrer"
  > 
    {blockNo}
  </a>
)

const timestampFormatter = timestamp => {
  const now = new Date().valueOf();
  const age = (now-(timestamp*1000))/1000;
  // console.log(age);
  let duration='';
  const durationInSeconds = { days:86400, hours:3600, mins:60, secs: 1  };
  for(const span in durationInSeconds) {
    const interval = age/durationInSeconds[span];
    if(interval>1) {
      // console.log(age/durationInSeconds[span]);
      duration+=Math.round(interval,0)+' '+span+' ago';
      break;
    }
  }
  return <Fragment>{duration}</Fragment>;
}

const fromAddressFormatter = address => (
  <a href={`https://etherscan.io/address/${address}`} 
    className="font-weight-semi-bold"
    target="_blank"
    rel="noopener noreferrer"
  > 
    {address.substring(0,20)+'...'}
  </a>
);

const toAddressFormatter = address => {
  if(!address) 
    return (
      <Badge color="soft-success" className="rounded-capsule">
        Contract Creation
      </Badge>
    );
  return (
    <a href={`https://etherscan.io/address/${address}`} 
      className="font-weight-semi-bold"
      target="_blank"
      rel="noopener noreferrer"
    > 
      {address.substring(0,20)+'...'}
    </a>
  )
}

const gasFormatter = gasAmt => {
  if(gasAmt==0) return 0;
  const divFactor = Math.pow(10,9);
  const gasInEth = gasAmt/divFactor;
  return (
      <span style={{lineHeight:'25px'}}>{gasInEth}</span>
  );
}

const gasHeaderFormatter = () => {
  return (
    <Fragment>
      <span style={{marginRight:'5px'}}>Gas</span>
      <img src={ethIcon} alt="eth-icon" style={{width:'20px', padding:'3px'}} />
    </Fragment>
  )
}

const columns = [
  {
    dataField: 'hash',
    text: 'Txn Hash',
    formatter: txHashFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false,
    // filter:textFilter({
    //   placeholder: columnFilterPlaceHolder()
    // })
  },
  {
    dataField: 'blockNumber',
    text: 'Block',
    formatter: blockNumberFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: true,
  },

  {
    dataField: 'timestamp',
    text: 'Age',
    formatter: timestampFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: true
  },

  {
    dataField: 'from',
    text: 'From',
    formatter: fromAddressFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false,
  },
  {
    dataField: 'to',
    text: 'To',
    formatter: toAddressFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false,
  },
  {
    dataField: 'gas',
    text: `Gas <img src=${ethIcon} alt="eth-icon"/>`,
    headerFormatter: gasHeaderFormatter,
    formatter: gasFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false
  }
];

const PurchasesTable = ({ pageSize, pageNums, totalSize, isAllRecentTxsPage, txSearchText, setPageSize, setTotalSize }) => {


  const { isDark } = useContext(AppContext);
  // stores all txs fetched from api
  const { txs, setTxs, areTxsReceived, setAreTxsReceived } = useContext(RecentTxsDataContext);
  // stores txs to be displayed based of search filter text
  const [displayTxs, setDisplayTxs] = useState(txs);
  // keeps track of the current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Pagination options
  const [options, setOptions] = useState({custom:true, sizePerPage:pageSize, totalSize});
  // show numbered pages when search filter is not triggered
  const [showNumberedPages, setShowNumberedPages] = useState(true);

  // updates showNumberedPages based on search filter text
  useEffect(() => {
    if(txSearchText==="") setShowNumberedPages(true);
    else setShowNumberedPages(false);
  },[txSearchText])

  // fetches data from api and updates txs
  const updateTxs = async () => {
    try {
      const recentTxUrl = 'https://dsa-info.herokuapp.com/api/dsa/tx/recent?key=Er2wUbHQ8hYADskWFk9JQntnf'
      const response = await axios.get(recentTxUrl);
      const { data } = response.data;
      setTxs(data);
      setDisplayTxs(data);
      setAreTxsReceived(true);
    }
    catch(err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if(txs.length===0)
      updateTxs();
  },[areTxsReceived]);

  // updates the txs to be displayed based on search filter text
  const updateDisplayTxs = () => {
      if(txSearchText==="") {
        setDisplayTxs(txs);
        setTotalSize(txs.length);
      }
      else {
        const txsToDisplay=[];
        for(const tx of txs) {
          let { hash, from, to } = tx;
          hash=hash.toLowerCase();
          from=from.toLowerCase();
          to=to.toLowerCase();
          const searchText=txSearchText.toLowerCase();
          if(hash.includes(searchText) || from.includes(searchText) || to.includes(searchText))
            txsToDisplay.push(tx);
        }
        setDisplayTxs(txsToDisplay);
        setTotalSize(txsToDisplay.length);
      }
      const options = {custom:true, sizePerPage:pageSize, totalSize};
      setOptions(options);
  };
  useEffect(() => {
    updateDisplayTxs();
  }, [areTxsReceived, txSearchText, pageSize, totalSize]);


  let table = createRef();

  const handlePrevPage = ({ page, onPageChange }) => () => {
    onPageChange(page - 1);
    setCurrentPage(page - 1);
  };

  const handleNextPage = ({ page, onPageChange }) => () => {
    onPageChange(page + 1);
    setCurrentPage(page + 1);
  };


  const handlePageSelection = ({ onPageChange }, page) => () => {
    onPageChange(page);
    setCurrentPage(page);
  }


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
                keyField="_id"
                data={displayTxs}
                columns={columns}
                bordered={false}
                classes="table-dashboard table-sm fs--1 border-bottom border-200 mb-0 table-dashboard-th-nowrap"
                rowClasses="btn-reveal-trigger border-top border-200"
                headerClasses="bg-200 text-900 border-y border-200"
                {...paginationTableProps}
              />
            </div>
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
                {showNumberedPages && isIterableArray(pageNums) && pageNums.map(page => 
                  <Button
                    key={page}
                    color={isDark ? themeColors.light : themeColors.primary}
                    size="xs"
                    onClick={handlePageSelection(paginationProps, page)}
                    className="pagination-page-num-btn d-none d-lg-inline-flex"
                    style={(page==currentPage) ? (isDark ? {backgroundColor:themeColors.light, color:themeColors.primary} : {backgroundColor:themeColors.primary, color:themeColors.light}): {} }
                  >
                    {page}
                  </Button>
                )}
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
          </Fragment>
        );
      }}
    </PaginationProvider>
  );
};

export default PurchasesTable;
