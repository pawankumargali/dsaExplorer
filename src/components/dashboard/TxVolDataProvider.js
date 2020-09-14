import React, { useState } from 'react';
import { TxVolDataContext } from '../../context/Context';

const TxVolDataProvider = ({ children }) => {

  const [txVolData, setTxVolData] = useState({});
  const [IsTxVolDataReceived, setIsTxVolDataReceived] = useState(false);
  
  return (<TxVolDataContext.Provider value={{txVolData, setTxVolData, IsTxVolDataReceived, setIsTxVolDataReceived}}>
              {children}
         </TxVolDataContext.Provider>);
}

export default TxVolDataProvider;