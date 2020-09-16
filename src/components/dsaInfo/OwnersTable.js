import React, { Fragment, createRef, useState, useEffect, useContext } from 'react';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import { Col, Row } from 'reactstrap';
import ButtonIcon from '../common/ButtonIcon';
// import AppContext from '../../context/Context';
import { hashFormatter } from '../../helpers/utils'
import { Link } from 'react-router-dom';


const CustomTotal = ({ sizePerPage, totalSize, page, lastIndex }) =>  {
  if(totalSize===0) 
    return (<span>
          </span>);
  return (<span style={{fontSize:'12px'}}>
          {(page - 1) * sizePerPage + 1} to {lastIndex > totalSize ? totalSize : lastIndex} of {totalSize} 
        </span>);
}

const addressFormatter = ownerAddress => (
  <Link to={`../owner/${ownerAddress}`} 
    className="font-weight-semi-bold"
  > 
    <span className="d-none d-lg-block">{hashFormatter(ownerAddress,12)}</span>
    <span className="d-none d-sm-block d-lg-none">{ownerAddress}</span>
    <span className="d-block d-sm-none">{hashFormatter(ownerAddress,30)}</span>

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

const OwnersTable = ({ pageSize, totalSize, owners, searchText, setTotalSize }) => {


  // const { isDark } = useContext(AppContext);
  
  // const { isDark } = useContext(AppContext);
  const [displayOwners, setDisplayOwners] = useState([]);
  // Pagination options
  const [options, setOptions] = useState({custom:true, sizePerPage:pageSize, totalSize});

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
    if(owners.length!==0)
      updateDisplayOwners();
  }, [owners.length, searchText, displayOwners.length]);


  
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
            {owners.length>pageSize &&
            <Row noGutters className="px-1 py-2">
              <Col className="pl-1 fs--1 py-1">
                <CustomTotal {...paginationProps} lastIndex={lastIndex} />
              </Col>
              <Col xs="auto" className="pr-1">
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
                  style={{fontWeight:600, marginLeft:0}}
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
