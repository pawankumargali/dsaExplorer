import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap';
import { isIterableArray } from '../../helpers/utils';
import SupplyBorrowStatusProgressBar from './SupplyBorrowStatusProgressBar';

const SupplyBorrowStatus = ({ data, className, height, width }) => {
  const total = data.map(d => d.size).reduce((total, currentValue) => total + currentValue, 0);
  return (
        <div className={`w-100 ${className}`}>
          <Progress multi className="rounded-soft mb-3 supply-borrow-progress-bar" style={{ height, width}}>
            {isIterableArray(data) &&
              data.map((d, index) => (
                <SupplyBorrowStatusProgressBar
                  {...d}
                  percentage={(d.size * 100) / total}
                  isLast={data.length - 1 === index}
                  key={index}
                />
              ))}
          </Progress>
        </div>
  );
};

SupplyBorrowStatus.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    }).isRequired
  )
};

export default SupplyBorrowStatus;
