import React, { useState, useEffect, Fragment } from 'react';
// import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Card } from 'reactstrap';
import { Link } from 'react-router-dom';
import ButtonIcon from '../common/ButtonIcon';
import { getDsaIdByAddress } from '../../helpers/dsaInterface';

const DsaTitleCard = ({ dsaAddress }) => {

  const [dsaId, setDsaId] = useState(0);
  const _getDSAId = async() => {
    const id = await getDsaIdByAddress(dsaAddress);
    setDsaId(id);
  }

  useEffect(() => {
    setDsaId(0);
  },[dsaAddress]);

  useEffect(() => {
    if(dsaId===0)
      _getDSAId();
  },[dsaId])

  return (
    <Card>
      <FalconCardHeader title="Net Position" light={false} titleTag="h5"
        title={
        <Fragment>
             <span 
              style={{ margin:'10px', color:'#fff', backgroundColor:'#2C7BE5', padding:'0px 10px', borderRadius:'5%'}}
            >
              DSA {dsaId}
            </span> 
            <a 
            href={`https://etherscan.io/address/${dsaAddress}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            {'  '+dsaAddress}
        </a>
        <Link to={`/dsa/${dsaAddress}`}>
            <ButtonIcon
            color="link"
            size="sm"
            icon="chevron-right"
            iconAlign="right"
            transform="down-1 shrink-4"
            className="px-0 font-weight-semi-bold"
            style={{marginLeft:'20px'}}
            >
            Explore
            </ButtonIcon>
        </Link>
            </Fragment>
        }
      />
    </Card>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default DsaTitleCard;
