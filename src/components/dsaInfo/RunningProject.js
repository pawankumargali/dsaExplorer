import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Media, Progress, Row, Col, Badge } from 'reactstrap';
import Flex from '../common/Flex';

const RunningProject = ({ token, isLast }) => {
  const { percentage, time, value } = token;
  const {usd, eth} = value;

  return (

          <Col lg={12} className="pr-card">
          <Flex align="center"  justify="between" className="mb-0">
          <Media>
            <div className={`avatar avatar-xl avatar-name rounded-circle` }>
              <img src="https://dsa.instadapp.io/assets/img/icons/erc20/dai.svg" />
            </div>
          </Media>
          <div className="fs--1 font-weight-semi-bold">{usd}
          </div>
          <div className="fs--1 font-weight-semi-bold">{eth}
          </div>
          <Badge pill className="bg-200 text-primary">
                {percentage}%
              </Badge>
            <Progress
              value={percentage}
              color="primary"
              className="w-100 rounded-soft bg-200"
              barClassName="rounded-capsule"
              style={{ height: '5px' }}
            />
            </Flex>
          </Col>
  );
};

RunningProject.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  isLast: PropTypes.bool
};

RunningProject.defaultProps = { isLast: false };

export default RunningProject;
