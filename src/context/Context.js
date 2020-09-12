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

// Search Address Context 
export const SearchAddressContext=createContext({});

// Positions Context
export const PositionsContext=createContext({compound:null, maker:null, aave:null, dydx:null});

// Balances Context
export const BalancesDataContext=createContext({});


export const EmailContext = createContext({ emails: [] });

export const ProductContext = createContext({ products: [] });

export const FeedContext = createContext({ feeds: [] });

export const AuthWizardContext = createContext({ user: {} });

export const ChatContext = createContext();

export const KanbanContext = createContext({ KanbanColumns: [], kanbanTasks: [] });

export default AppContext;
