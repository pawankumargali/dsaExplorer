import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Progress, Row } from 'reactstrap';
import Flex from '../common/Flex';
import { isIterableArray } from '../../helpers/utils';
import StorageStatusProgressBar from './StorageStatusProgressBar';
// import StorageStatusDot from './StorageStatusDot';

const StorageStatus = ({ data, className, height, width }) => {
  const total = data.map(d => d.size).reduce((total, currentValue) => total + currentValue, 0);
  return (
        <div className="w-100">
          <Progress multi className="rounded-soft mb-3" style={{ height, width}}>
            {isIterableArray(data) &&
              data.map((d, index) => (
                <StorageStatusProgressBar
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

StorageStatus.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    }).isRequired
  )
};

export default StorageStatus;