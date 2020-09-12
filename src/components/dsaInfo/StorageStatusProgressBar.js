import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Badge, Progress } from 'reactstrap';
import { numberFormatter } from '../../helpers/utils';
import classNames from 'classnames';
import ethIcon from '../../assets/img/tokens/eth.svg';

const StorageStatusProgressBar = ({ color, percentage, isLast, size, sizeInEth }) => (
  <Progress
    bar
    color={color}
    value={percentage}
    className={classNames({ 'border-right border-white border-2x': !isLast })}
  >
    <span className="font-weight-semi-bold">
      {'$'+numberFormatter(size,2)}
    </span>
  </Progress>
);

StorageStatusProgressBar.propTyeps = {
  color: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  isLast: PropTypes.bool
};

StorageStatusProgressBar.defaultProps = { isLast: false };

export default StorageStatusProgressBar;
