import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Flex from '../common/Flex';
import Dot from '../common/Dot';
import AppContext from '../../context/Context';
import { numberFormatter } from '../../helpers/utils';
import { Badge } from 'reactstrap';
import tokens from '../../tokens';

const BalanceItem = ({ token, color, name, amt, usd, eth, totalUSD }) => {
  
  const{ currency } = useContext(AppContext);
  // const inlineStyle = { width: '30%', textAlign:'left' };
  return (
      <Flex align="center" justify="start" className="balance-item-div">

        <Flex align="center" justify="start" style={{minWidth:'120px'}}>
          <div style={{width:'10px', height:'10px', backgroundColor:color, marginRight:'10px', borderRadius:'50%'}}></div>
          <span className="font-weight-semi-bold">{name}</span>
        </Flex>
      

      <Flex className="d-xxl-none font-weight-semi-bold" style={{minWidth:'100px'}}>
          <img src={tokens[token].icon} alt={name} style={{marginRight:'5px',width:'20px'}} />
          {amt < 0.001 ? numberFormatter(amt,6) : numberFormatter(amt,2)}
      </Flex>


      <Badge pill color="soft-info" className="fs--2 d-lg-block font-weight-semi-bold"
        style={{minWidth:'40px'}}
      > 
        {numberFormatter((usd/totalUSD)*100,0)+' %'} 
      </Badge>

      <Flex className="bal-breakup-usd font-weight-semi-bold" style={{marginLeft:'20px'}}>
          {currency+(usd < 0.001 ? numberFormatter(usd,6) : numberFormatter(usd,2)) }
         
      </Flex>

    </Flex>
  );
}
BalanceItem.propsType = {
  token:PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amt: PropTypes.number.isRequired,
  usd: PropTypes.number.isRequired,
  totalUSD: PropTypes.number.isRequired,
};

export default BalanceItem;