import React, { createRef  } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Badge from 'reactstrap/es/Badge';
// import { Button, Col, Row } from 'reactstrap';
// import ButtonIcon from '../common/ButtonIcon';
import { numberFormatter } from '../../helpers/utils';
import tokens from '../../tokens';
import Flex from '../common/Flex';


// const tokenLabelFormatter = tokenLabel => {
//   const color = (tokenLabel==='Collateral' || tokenLabel==='Lent') ? 'soft-success' : 'soft-warning';
//    return(
//      <Badge color={color} className="fs--1 d-lg-block font-weight-semi-bold" style={{maxWidth:'100px'}}> 
//        {tokenLabel}
//      </Badge>
//    );
// };

const tokenNameFormatter = token => (
    <Flex justify="center" align="center" style={{maxWidth:'150px'}}>
        <img src={tokens[token].icon} alt={token} style={{width:'20px', marginRight:'10px'}}/>
        <span style={{lineHeight:'25px', fontWeight:'700', fontSize:'0.9rem'}}>{tokens[token].name}</span>
    </Flex>
)
const tokenAmtFormatter = tokenAmt => (
    <span style={{lineHeight:'25px', fontWeight:'700', fontSize:'0.9rem', maxWidth:'150px' }}>{tokenAmt < 0.001 ? numberFormatter(tokenAmt,6) : numberFormatter(tokenAmt,2)}</span>
)

const tokenAmtInUSDFormatter = tokenAmt => (
    <span style={{lineHeight:'25px', fontWeight:'700', fontSize:'0.9rem', maxWidth:'150px'}}>{'$'+(tokenAmt < 0.001 ? numberFormatter(tokenAmt,6) : numberFormatter(tokenAmt,2)) }</span>
    

)

const tokenRateFormatter = tokenRate => {
    if(!tokenRate) return '';
    const {color, percentage} = tokenRate;
    return(
    <Badge color={color} className="fs--1 d-lg-block font-weight-semi-bold" style={{maxWidth:'100px'}}> 
        {'Rate '+Math.round(percentage*100)/100+'%'}
    </Badge>
    );
  };

const columns = [
    // {
    //   dataField: 'label',
    //   text: 'Label',
    //   headerAttrs: { hidden: true },
    //   formatter: tokenLabelFormatter,
    //   classes: 'border-0 align-middle',
    //   headerClasses: 'border-0',
    //   sort: false
    // },

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
        dataField: 'value',
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
      dataField: 'rate',
      text: 'Rate',
      headerAttrs: { hidden: true },
      formatter: tokenRateFormatter,
      classes: 'border-0 align-middle',
      headerClasses: 'border-0',
      sort: false
    }
  ];




const TokenSupplyBorrowTable = ({ tokenDetails }) => {


  // const { isDark } = useContext(AppContext);

  let table = createRef();

  return (
            <div className="table-responsive">
              <BootstrapTable
                ref={table}
                bootstrap4
                keyField="token"
                data={tokenDetails}
                columns={columns}
                bordered={false}
                classes="table-dashboard table-sm fs--1 border-bottom border-200 mb-0 table-dashboard-th-nowrap"
                rowClasses="btn-reveal-trigger border-top border-200"
                headerClasses="bg-200 text-900 border-y border-200"
              />
            </div>
  );
};

export default TokenSupplyBorrowTable;
