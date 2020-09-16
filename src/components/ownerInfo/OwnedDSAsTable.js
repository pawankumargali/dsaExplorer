import React, { Fragment, createRef, useState, useEffect, useContext } from 'react';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import { Col, Row } from 'reactstrap';
import ButtonIcon from '../common/ButtonIcon';
// import AppContext from '../../context/Context';
import { hashFormatter } from '../../helpers/utils';

const CustomTotal = ({ sizePerPage, totalSize, page, lastIndex }) =>  {
  if(totalSize===0) 
    return (<span>
          </span>);
  return (<span style={{fontSize:'12px'}}>
          {(page - 1) * sizePerPage + 1} to {lastIndex > totalSize ? totalSize : lastIndex} of {totalSize} 
        </span>);
}


const OwnedDSAsTable = ({ pageSize, totalSize, searchText, setTotalSize, dsas, currentDsa, setCurrentDsa }) => {

  // const { isDark } = useContext(AppContext);
  
  const [displayDsas, setDisplayDsas] = useState([]);

  const activeDsaStyles = { backgroundColor:'#2C7BE5', color:'#fff' };
  const dsaStyles={ cursor:'pointer', padding:'7px', color:'#2C7BE5'};
  const addressFormatter = dsa => {
    const {address, isActive} = dsa;
    // console.log(dsa);
    return (
      <div 
        onClick={() => setCurrentDsa(address)}
        style={!isActive ? {...dsaStyles} :{...dsaStyles,...activeDsaStyles,}}
        className="dsas-table-address-cell"
      > 
        <span  className="font-weight-semi-bold d-none d-lg-block">{hashFormatter(address,12)}</span>
        <span  className="font-weight-semi-bold d-none d-sm-block d-lg-none">{address}</span>
        <span  className="font-weight-semi-bold d-block d-sm-none">{hashFormatter(address,18)}</span>

      </div>
    );
  }

  const columns = [
    {
      dataField: 'dsa',
      text: 'DSA',
      headerAttrs: { hidden: true },
      formatter: addressFormatter,
      classes: 'border-0 align-middle',
      headerClasses: 'border-0',
      sort: false,
    }
  ];

  
  // Pagination options
  const [options, setOptions] = useState({custom:true, sizePerPage:pageSize, totalSize});
  // show numbered pages when search filter is not triggered


  // updates the owners to be displayed based on search filter text
  const updateDisplayDSAs = () => {
    // console.log(dsas);
    const dsasToDisplay=[];
    if(searchText==="") {
      for(const dsa of dsas) {
        const {id, address} = dsa;
        if(currentDsa===address)
          dsasToDisplay.push({id, dsa:{address, isActive:true}});
        else
         dsasToDisplay.push({id, dsa:{ address }});
      }
    }
    else {
      for(const dsa of dsas) {
        const {id, address} = dsa;
        console.log(dsa);
        if(dsa.address.includes(searchText)) {
          if(currentDsa===address)
            dsasToDisplay.push({id, dsa:{address, isActive:true}});
          else
            dsasToDisplay.push({id, dsa:{ address }});
        }
      }
    }
    setDisplayDsas(dsasToDisplay);
    setTotalSize(dsasToDisplay.length);
    const options = {custom:true, sizePerPage:pageSize, totalSize};
    setOptions(options);
  };
  useEffect(() => {
    if(dsas.length!==0)
      updateDisplayDSAs();
  }, [dsas.length, currentDsa, searchText, totalSize, displayDsas.length]);


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
                data={displayDsas}
                columns={columns}
                bordered={false}
                classes="table-dashboard table-sm fs--1 border-bottom border-200 mb-0 table-dashboard-th-nowrap"
                rowClasses="btn-reveal-trigger border-top border-200"
                headerClasses="bg-200 text-900 border-y border-200"
                {...paginationTableProps}
              />
            </div>
            {dsas.length>pageSize &&
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

export default OwnedDSAsTable;
