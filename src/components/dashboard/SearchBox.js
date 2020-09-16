import React from 'react';
import { Form, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBox = ({icon, placeholder, idName, searchText, setSearchText, onSubmitHandler}) =>  {


  const handleChange = e => setSearchText(e.target.value);
  
  return (
    <Form inline className='search-box' id={idName} onSubmit={onSubmitHandler}>
      <Input type="search" placeholder={placeholder} aria-label="Search" className="search-input"
        spellCheck={false}
        value={searchText}
        onChange={handleChange}
      />
      <FontAwesomeIcon icon={icon} className="position-absolute text-400 search-box-icon"/>
    </Form>
  );
}


export default SearchBox;
