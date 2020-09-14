import { createContext } from 'react';

const AppContext = createContext({
  isFluid: false,
  isRTL: false,
  isDark: false,
  showBurgerMenu: false, // controls showing vertical nav on mobile
  currency: '$',
  isNavbarVerticalCollapsed: false,
  navbarStyle: 'vibrant'
});

// 24hr Tx Volume Context
export const TxVolDataContext = createContext({});

// Recent Txs List Context
export const RecentTxsDataContext=createContext({});

// Positions Context
export const PositionsContext=createContext({compound:null, maker:null, aave:null, dydx:null});

// Balances Context
export const BalancesDataContext=createContext({});

// App Context
export default AppContext;
