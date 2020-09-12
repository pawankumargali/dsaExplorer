import React, { useContext, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import ButtonIcon from '../common/ButtonIcon';

const DsaTitleCard = ({ dsaAddress }) => {

  return (
    <Card>
      <FalconCardHeader title="Net Position" light={false} titleTag="h5"
        title={
        <Fragment>
            DSA 
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
