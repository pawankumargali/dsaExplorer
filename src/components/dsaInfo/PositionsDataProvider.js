import React, { useState } from 'react';
import { PositionsContext } from '../../context/Context';
import { getCompoundPosition, getMakerPosition, getAavePosition, getDydxPosition } from '../../dsaInterface';

const PositionsDataProvider = ({ children }) => {

  const [positions, setPositions] = useState({compound:null, maker:null, aave:null, dydx:null});
  const [arePositionsReceived, setArePositionsReceived] = useState(false);

  const initPositions = async dsaAddress => {      
    const [maker, compound, aave, dydx] = await Promise.all([ getMakerPosition(dsaAddress), getCompoundPosition(dsaAddress), getAavePosition(dsaAddress), getDydxPosition(dsaAddress)]);
    const pos = {compound, maker, aave, dydx};
    setPositions(pos);
    setArePositionsReceived(true);
 }
  
  return (<PositionsContext.Provider value={{positions, arePositionsReceived, setArePositionsReceived, initPositions}}>
            {children}
         </PositionsContext.Provider>);
}

export default PositionsDataProvider;