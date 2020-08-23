import React, { useState } from 'react';
import { RecentTxsDataContext } from '../../context/Context';

const RecentTxsDataProvider = ({ children }) => {

  const [txs, setTxs] = useState([]);
  const [areTxsReceived, setAreTxsReceived] = useState(false);
  
  return (<RecentTxsDataContext.Provider value={{ txs, setTxs, areTxsReceived, setAreTxsReceived }}>
              {children}
         </RecentTxsDataContext.Provider>);
}

export default RecentTxsDataProvider;