import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Flex from '../common/Flex';
import Dot from '../common/Dot';
import AppContext from '../../context/Context';
import { numberFormatter } from '../../helpers/utils';
import ethIcon from '../../assets/img/tokens/eth.svg';

const MarketShareItem = ({ color, name, usd, eth, totalUSD }) => {
  
  const{ currency } = useContext(AppContext);
  const inlineStyle = { width: '20%', textAlign:'left' };
  return (
    <Flex justify="between" align="start" className="mb-1" id="tx-vol-breakup-item">
      <Flex align="center">
        <Dot style={{ backgroundColor: color }} />
        <span className="font-weight-semi-bold" style={{minWidth:'60px'}}>{name}</span>
      </Flex>
      <div className="d-xxl-none font-weight-semi-bold" style={inlineStyle}>
          {((usd * 100) / totalUSD).toFixed(0)}%
      </div>
      <div className="d-none  d-sm-block d-xxl-none font-weight-semi-bold" style={inlineStyle}>
        <span className="font-weight-semi-bold">{currency}</span>
        <span className="font-weight-semi-bold" style={{padding:'3px'}}>{numberFormatter(usd,0)}</span>
      </div>
      <div className="d-none d-sm-block d-md-none d-lg-block d-xxl-none font-weight-semi-bold" style={inlineStyle}>
        <img src={ethIcon} alt="eth-icon" style={{width:'18px', padding:'3px'}}/>
        <span style={{padding:'3px'}}>{numberFormatter(eth,0)}</span>
      </div>
    </Flex>
  );
}
MarketShareItem.propsType = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  totalShare: PropTypes.number.isRequired
};

export default MarketShareItem;
