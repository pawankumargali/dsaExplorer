import React, { useState } from 'react';
import { SearchAddressContext } from '../../context/Context';

const SearchAddressProvider = ({ children }) => {

  const [searchAddress, setSearchAddress] = useState('');
  
  return (<SearchAddressContext.Provider value={{searchAddress, setSearchAddress}}>
              {children}
         </SearchAddressContext.Provider>);
}

export default SearchAddressProvider;