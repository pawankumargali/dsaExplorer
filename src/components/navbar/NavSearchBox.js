import React, { useContext, useEffect, useState } from 'react';
import { Form, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchAddressContext } from '../../context/Context';
import {isDSA, isOwner} from '../../dsaInterface';

const NavSearchBox = ({icon, placeholder, className, history }) =>  {

  // const { searchAddress, setSearchAddress } = useContext(SearchAddressContext);
  const [searchAddress, setSearchAddress] = useState('');

  const handlePageRedirect = async e => {
    e.preventDefault();
    setSearchAddress(searchAddress);
    if(searchAddress==='') return;
    const [IsDsa, IsOwner] = await Promise.all([ isDSA(searchAddress), isOwner(searchAddress)]);
    setSearchAddress('');
    if(IsDsa) 
      return history.push(`/dsa/${searchAddress}`);
    if(IsOwner)
      return history.push(`/owner/${searchAddress}`);
    return history.push(`/errors/404`);
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
