import React, { Fragment, createRef, useState, useEffect, useContext } from 'react';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import { Col, Row } from 'reactstrap';
import ButtonIcon from '../common/ButtonIcon';
import AppContext from '../../context/Context';
import { getAccounts } from '../../helpers/dsaInterface';

const CustomTotal = ({ sizePerPage, totalSize, page, lastIndex }) =>  {
  if(totalSize===0) 
    return (<span>
            No matches
          </span>);
  return (<span>
          {(page - 1) * sizePerPage + 1} to {lastIndex > totalSize ? totalSize : lastIndex} of {totalSize} 
        </span>);
}

const OwnedDSAsTable = ({ pageSize, totalSize, searchText, setTotalSize, ownerAddress, currentDsa, setCurrentDsa }) => {

// dsaAddress===currentDsa ? {...dsaStyles,...activeDsaStyles} : 
  const { isDark } = useContext(AppContext);
  const [isCurrent, setIsCurrent] = useState(true);

  const activeDsaStyles = {backgroundColor:'#2C7BE5', color:'#fff'};
  const dsaStyles={cursor:'pointer', padding:'7px', color:'#2C7BE5', width:'140px'};
  const addressFormatter = dsaAddress => (
    <div 
      onClick={() => setCurrentDsa(dsaAddress)}
      style={{...dsaStyles}}
      className="font-weight-semi-bold"
    > 
      {dsaAddress.substring(0,7)+'...'+dsaAddress.substring(dsaAddress.length-7)}
    </div>
  );
  
  const columns = [
    {
      dataField: 'address',
      text: 'DSA',
      headerAttrs: { hidden: true },
      formatter: addressFormatter,
      classes: 'border-0 align-middle',
      headerClasses: 'border-0',
      sort: false,
    }
  ];
  

  const [dsas, setDsas] = useState([]);
  const [areDsasReceived, setAreDsasReceived] = useState(false);
  const [displayDsas, setDisplayDsas] = useState([]);
  
  // Pagination options
  const [options, setOptions] = useState({custom:true, sizePerPage:pageSize, totalSize});
  // show numbered pages when search filter is not triggered

  // fetches data and updates owners
  const updateDSAs = async () => {
    try {
      const data = await getAccounts(ownerAddress);
      // console.log(data);
      const addresses = [];
      data.forEach(({id, address}) => addresses.push({id,address}));
      setDsas(addresses);
      if(currentDsa==='')
        setCurrentDsa(addresses[0].address);
      setDisplayDsas(addresses);
      setAreDsasReceived(true);
    }
    catch(err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if(dsas.length===0)
      updateDSAs();
  },[areDsasReceived]);

  // updates the owners to be displayed based on search filter text
  const updateDisplayDSAs = () => {
      if(searchText==="") {
        setDisplayDsas(dsas);
        setTotalSize(dsas.length);
      }
      else {
        const dsasToDisplay=[];
        for(const dsa of dsas) {
          if(dsa.address.includes(searchText))
            dsasToDisplay.push(dsa);
        }
        setDisplayDsas(dsasToDisplay);
        setTotalSize(dsasToDisplay.length);
      }
      const options = {custom:true, sizePerPage:pageSize, totalSize};
      setOptions(options);
  };
  useEffect(() => {
    if(areDsasReceived && searchText!=="")
      updateDisplayDSAs();
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
                data={displayDsas}
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

export default OwnedDSAsTable;
