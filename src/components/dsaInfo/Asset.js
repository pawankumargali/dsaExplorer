import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row, Button, Collapse, CardFooter, InputGroup, CustomInput } from 'reactstrap';
import Flex from '../common/Flex';
import { numberFormatter, isIterableArray, themeColors, getPosition, getGrays, colors } from '../../helpers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { SearchAddressContext } from '../../context/Context';
import { getBalances } from '../../dsaInterface';
import { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD } from '../../coinExPrices';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ethIcon from '../../assets/img/tokens/eth.svg';
import tokens from '../../tokens';
import BalanceItem from './BalanceItem';

import MakerVault from './MakerVault';







const Asset = ({assets, currentAsset, handleAssetChange, vaults, currentVault, handleVaultChange}) => {
  const { isDark, currency } = useContext(AppContext);

  return (
    <Card className="h-md-100 bg-gradient">
     
      <CardBody>
      <h5 id="asset-heading" className="text-white mb-3">
          Asset
      </h5>
      <InputGroup size="sm" className="input-group input-group-sm">
        <CustomInput 
            type="select" 
            id="bulk-select"
            value={currentAsset}
            onChange={handleAssetChange}
            >  
            {assets.map(asset =>
                <option key={asset} value={asset} >
                    {asset==='dydx'? 'dYdX' : asset.substring(0,1).toUpperCase()+asset.substring(1)}
                </option>
            )} 

            {/* <MakerVault 
            vaults={vaults}
            currentVault={currentVault}
            handleVaultChange={handleVaultChange}
          /> */}
        </CustomInput>
      </InputGroup>
      
      </CardBody>
    </Card>


  );
};

// TotalOrder.propTypes = { data: PropTypes.array.isRequired };

export default Asset;
