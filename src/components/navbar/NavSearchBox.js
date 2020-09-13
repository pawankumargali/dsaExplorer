import React, { useContext, useEffect, useState } from 'react';
import { Form, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchAddressContext } from '../../context/Context';
import {getDsaAddressById, getGlobalDsaCount,getDsaIdByAddress, getAccounts } from '../../dsaInterface';

const NavSearchBox = ({icon, placeholder, className, history }) =>  {

  // const { searchAddress, setSearchAddress } = useContext(SearchAddressContext);
  const [searchAddress, setSearchAddress] = useState('');

  const handlePageRedirect = async e => {
    e.preventDefault();
    setSearchAddress(searchAddress);
    if(searchAddress==='') return;
    const dsaAccounts = await getAccounts(searchAddress);
    setSearchAddress(''); 
    // If is Owner Address
    if(dsaAccounts.length!==0)
      return history.push(`/owner/${searchAddress}`);
    else 
      return history.push(`/dsa/${searchAddress}`);
  }

  const handleChange = e => setSearchAddress(e.target.value);

  return (
    <Form inline className={`search-box ${className}`} onSubmit={handlePageRedirect}>
      <Input type="search" placeholder={placeholder} aria-label="Search" className="search-input"
        spellCheck={false}
        value={searchAddress}
        onChange={handleChange}
      />
      <FontAwesomeIcon icon={icon} className="position-absolute text-400 search-box-icon"/>
    </Form>
  );
}


export default NavSearchBox;
