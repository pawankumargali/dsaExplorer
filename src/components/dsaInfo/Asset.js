import React  from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, InputGroup, CustomInput } from 'reactstrap';
// import AppContext from '../../context/Context';


const Asset = ({assets, currentAsset, handleAssetChange}) => {
  // const { isDark, currency } = useContext(AppContext);

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
        </CustomInput>
      </InputGroup>
      
      </CardBody>
    </Card>


  );
};

Asset.propTypes = { 
  assets: PropTypes.array.isRequired,
  currentAsset:PropTypes.string.isRequired,
  handleAssetChange:PropTypes.func.isRequired
};

export default Asset;
