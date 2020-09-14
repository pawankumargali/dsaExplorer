import React, { useState, useEffect, Fragment } from 'react';
// import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Card } from 'reactstrap';
import { getDsaIdByAddress } from '../../helpers/dsaInterface';
import DsaIdAndAddress from '../dsaInfo/DsaIdAndAddress';

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
          <DsaIdAndAddress 
            dsaAddress={dsaAddress}
            dsaId={dsaId}
            isPreview={true}
          />
        }
      />
    </Card>
  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default DsaTitleCard;
