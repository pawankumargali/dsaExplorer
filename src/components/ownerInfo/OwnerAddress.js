import React, { Fragment } from 'react';
import { hashFormatter } from '../../helpers/utils';

function DsaIdAndAddress({ ownerAddress }) {
    return (
    <Fragment>
        <span 
            style={{ margin:'10px', color:'#fff', backgroundColor:'#2C7BE5', padding:'0px 10px', borderRadius:'5%'}}
        >
            Owner
        </span>
        {/* Address display sm-md-lg */}
        <a  className="d-none d-sm-inline"
            href={`https://etherscan.io/address/${ownerAddress}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            {' '+ownerAddress}
        </a>
        {/* Address display xs */}
        <a  className="d-inline d-sm-none"
            href={`https://etherscan.io/address/${ownerAddress}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            {hashFormatter(ownerAddress,16)}
        </a>
    </Fragment>
    );
}

export default DsaIdAndAddress;