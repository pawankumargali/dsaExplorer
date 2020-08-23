import React from 'react';
import { Form, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBox = ({isSearchBoxRound}) => {  

  const inputBoxClassName = isSearchBoxRound ? "rounded-pill search-input" : "search-input";

  return (
  <Form inline className="search-box">
    <Input type="search" placeholder="Search by address" aria-label="Search" className={inputBoxClassName}
      spellCheck={false}
     />
    <FontAwesomeIcon icon="search" className="position-absolute text-400 search-box-icon" />
  </Form>
  );
}

export default SearchBox;
