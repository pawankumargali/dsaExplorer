import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap';
import { numberFormatter } from '../../helpers/utils';
import classNames from 'classnames';

const SupplyBorrowStatusProgressBar = ({ color, percentage, isLast, size }) => (
  <Progress
    bar
    color={color}
    value={percentage}
    className={classNames({ 'border-right border-white border-2x': !isLast })}
  >
    <span className="font-weight-bold" style={{color:'#fff'}}>
      {'$'+numberFormatter(size,2)}
    </span>
  </Progress>
);

SupplyBorrowStatusProgressBar.propTyeps = {
  color: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  isLast: PropTypes.bool
};

SupplyBorrowStatusProgressBar.defaultProps = { isLast: false };

export default SupplyBorrowStatusProgressBar;
