import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { hashFormatter } from '../../helpers/utils';
import ButtonIcon from '../common/ButtonIcon';

function DsaIdAndAddress({dsaAddress, dsaId, isPreview}) {
    return (
    <Fragment>
        <span 
            style={{ margin:'10px', color:'#fff', backgroundColor:'#2C7BE5', padding:'0px 10px', borderRadius:'5%'}}
        >
            DSA {dsaId}
        </span>
        {/* Address display sm-md-lg */}
        <a  className="d-none d-sm-inline"
            href={`https://etherscan.io/address/${dsaAddress}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            {' '+dsaAddress}
        </a>
        {/* Address display xs */}
        <a  className="d-inline d-sm-none"
            href={`https://etherscan.io/address/${dsaAddress}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            {hashFormatter(dsaAddress,14)}
        </a>
        {isPreview &&
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
        }
    </Fragment>
    );
}

export default DsaIdAndAddress;