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
import { getBalances, getAuthorizedAddresses } from '../../dsaInterface';
import { Link } from 'react-router-dom';


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
  <Link to={`../owner/${ownerAddress}`} 
    className="font-weight-semi-bold"
  > 
    {ownerAddress.substring(0,20)+'...'}
  </Link>
);

const columns = [
  {
    dataField: 'address',
    text: 'Owner',
    headerAttrs: { hidden: true },
    formatter: addressFormatter,
    classes: 'border-0 align-middle',
    headerClasses: 'border-0',
    sort: false,
  }
];

const OwnersTable = ({ pageSize, totalSize, searchText, setTotalSize, dsaAddress }) => {


  const { isDark } = useContext(AppContext);

  const [owners, setOwners] = useState([]);
  const [areOwnersReceived, setAreOwnersReceived] = useState(false);
  const [displayOwners, setDisplayOwners] = useState([]);
  
  // Pagination options
  const [options, setOptions] = useState({custom:true, sizePerPage:pageSize, totalSize});
  // show numbered pages when search filter is not triggered

  // fetches data and updates owners
  const updateOwners = async () => {
    try {
      const data = await getAuthorizedAddresses(dsaAddress);
      // console.log(data);
      const ownrs = [];
      data.forEach((owner, index) => ownrs.push({id:index, address:owner}));
      setOwners(ownrs);
      setDisplayOwners(ownrs);
      setAreOwnersReceived(true);
    }
    catch(err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if(owners.length===0)
      updateOwners();
  },[areOwnersReceived]);

  // updates the owners to be displayed based on search filter text
  const updateDisplayOwners = () => {
      if(searchText==="") {
        setDisplayOwners(owners);
        setTotalSize(owners.length);
      }
      else {
        const ownersToDisplay=[];
        for(const owner of owners) {
          if(owner.address.includes(searchText))
            ownersToDisplay.push(owner);
        }
        setDisplayOwners(ownersToDisplay);
        setTotalSize(ownersToDisplay.length);
      }
      const options = {custom:true, sizePerPage:pageSize, totalSize};
      setOptions(options);
  };
  useEffect(() => {
    if(areOwnersReceived && searchText!=="")
      updateDisplayOwners();
  }, [searchText, totalSize]);


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
                keyField="id"
                data={displayOwners}
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

export default OwnersTable;
