import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, InputGroup, CustomInput } from 'reactstrap';
// import AppContext from '../../context/Context';


const MakerVault = ({vaults, currentVault, handleVaultChange}) => {
  // const { isDark, currency } = useContext(AppContext);

  return (
    <Card className="h-md-100 bg-gradient">
     
      <CardBody>
      <h5 id="asset-heading" className="text-white mb-3">
          Vault #
      </h5> 
      <InputGroup size="sm" className="input-group input-group-sm">
        <CustomInput 
            type="select" 
            id="bulk-select"
            value={currentVault}
            onChange={handleVaultChange}
            >  
            {vaults.map(vaultNo =>
                <option key={vaultNo} value={vaultNo} >
                    {vaultNo}
                </option>
            )} 
        </CustomInput>
      </InputGroup>
      </CardBody>
    </Card>


  );
};

MakerVault.propTypes = { 
  vaults: PropTypes.array.isRequired, 
  currentVault: PropTypes.string.isRequired,
  handleVaultChange: PropTypes.func.isRequired
};

export default MakerVault;
