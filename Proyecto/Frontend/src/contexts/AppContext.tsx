import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { BudgetData, BudgetEntry, EducationalContent } from '../types';
import { set } from 'date-fns';

interface User {
  id?: string;
  email: string;
  name?: string;
  role?: string;
}

interface Account {
  id?: string;
  accountName: string;
  accountNumber: string;
  accountType: 'CASH' | 'SAVINGS' | 'CHECKING' | 'CREDIT_CART' | 'INVESTMENT' | 'OTHER';
  accountCurrency: 'USD' | 'EUR' | 'COP';
  cachedBalance: number;
  isActive: boolean;
  createdAt?: string;
}

interface TransactionTbl {
  id?: string;
  transactionType: string;
  amount: string;
  currency: string;
  description: string;
  ocurredAt: string;
  createdAt: string;
  isReconciled: string;
  metadata: string;
}
interface Obligations {
  id?:string;
  title:string;
  amountTotal:string;
  amountRemaining:string;
  currency:string;
  dueDate:string;
  frequency:string;
  state:string;
  createdAt?:string;
}

interface AppState {
  currentView: string;
  budgetData: BudgetData;
  educationalContent: EducationalContent | null;
  selectedText: string;
  showAssistant: boolean;
  isAuthenticated: boolean;
  showHomePage: boolean;
  currentAuthView: 'home' | 'login' | 'register' | 'forgot-password';
  user: User | null;
  token: string | null;
  accounts: Account[];
  obligations: Obligations[];
  transactions: TransactionTbl[];
  accountCount: number;
  transactionCount:number;
  obligationCount:number;
  userFinancials?: {
    ingresos: number;
    gastos: number;
    ahorro: number;
    perfilRiesgo?: string;
  };
}

interface AppAction {
  type: 'SET_VIEW' | 'UPDATE_BUDGET' | 'SET_EDUCATIONAL_CONTENT' | 'SET_SELECTED_TEXT' | 'TOGGLE_ASSISTANT' | 'ADD_INCOME' | 
  'ADD_EXPENSE' | 'REMOVE_INCOME' | 'REMOVE_EXPENSE' | 'SET_RISK_PROFILE' | 'SET_AUTHENTICATED' | 'SET_SHOW_HOME_PAGE' | 'SET_AUTH_VIEW' | 
  'SET_USER' | 'SET_TOKEN' | 'LOGOUT' | 'SET_ACCOUNTS' | 'SET_ACCOUNT_COUNT' | 'SET_TRANSACTION_COUNT' | 'SET_TRANSACTIONS'|
  'SET_OBLIGATIONS' | 'SET_OBLIGATION_COUNT';
  payload?: any;
}

const initialState: AppState = {
  currentView: 'dashboard',
  budgetData: {
    income: [],
    expenses: [],
    totalIncome: 0,
    totalExpenses: 0,
    availableMoney: 0,
    availablePercentage: 0,
  },
  educationalContent: null,
  selectedText: '',
  showAssistant: false,
  isAuthenticated: false,
  showHomePage: true,
  currentAuthView: 'home',
  user: null,
  token: null,
  accounts: [],
  obligations: [],
  transactions: [],
  accountCount: 0,
  transactionCount:0,
  obligationCount: 0,
  userFinancials: {
    ingresos: 0,
    gastos: 0,
    ahorro: 0,
    perfilRiesgo: undefined,
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  showChat: boolean;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  userFinancials?: {
    ingresos: number;
    gastos: number;
    ahorro: number;
    perfilRiesgo?: string;
  };
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setAccounts: (accounts: Account[]) => void;
  setAccountCount: (count: number) => void;
  setTransactions: (transactions: TransactionTbl[]) => void;
  setTransactionCount: (count: number) => void;
  setObligations: (obligations: Obligations[]) => void;
  setObligationCount: (count: number) => void;
}>({
  state: initialState,
  dispatch: () => null,
  showChat: false,
  setShowChat: () => {},
  userFinancials: undefined,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
  setAccounts: () => {},
  setAccountCount: () => {},
  setTransactionCount: () => {},
  setTransactions: () => {},
  setObligations: () => {},
  setObligationCount: () => {},
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'ADD_INCOME': {
      const newIncome = [...state.budgetData.income, action.payload as BudgetEntry];
      const newTotalIncome = newIncome.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        ...state,
        budgetData: {
          ...state.budgetData,
          income: newIncome,
          totalIncome: newTotalIncome,
          availableMoney: newTotalIncome - state.budgetData.totalExpenses,
          availablePercentage: newTotalIncome > 0 ? ((newTotalIncome - state.budgetData.totalExpenses) / newTotalIncome) * 100 : 0,
        },
      };
    }
    case 'ADD_EXPENSE': {
      const newExpenses = [...state.budgetData.expenses, action.payload as BudgetEntry];
      const newTotalExpenses = newExpenses.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        ...state,
        budgetData: {
          ...state.budgetData,
          expenses: newExpenses,
          totalExpenses: newTotalExpenses,
          availableMoney: state.budgetData.totalIncome - newTotalExpenses,
          availablePercentage: state.budgetData.totalIncome > 0 ? ((state.budgetData.totalIncome - newTotalExpenses) / state.budgetData.totalIncome) * 100 : 0,
        },
      };
    }
    case 'REMOVE_INCOME': {
      const filteredIncome = state.budgetData.income.filter((_, index) => index !== action.payload);
      const updatedTotalIncome = filteredIncome.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        ...state,
        budgetData: {
          ...state.budgetData,
          income: filteredIncome,
          totalIncome: updatedTotalIncome,
          availableMoney: updatedTotalIncome - state.budgetData.totalExpenses,
          availablePercentage: updatedTotalIncome > 0 ? ((updatedTotalIncome - state.budgetData.totalExpenses) / updatedTotalIncome) * 100 : 0,
        },
      };
    }
    case 'REMOVE_EXPENSE': {
      const filteredExpenses = state.budgetData.expenses.filter((_, index) => index !== action.payload);
      const updatedTotalExpenses = filteredExpenses.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        ...state,
        budgetData: {
          ...state.budgetData,
          expenses: filteredExpenses,
          totalExpenses: updatedTotalExpenses,
          availableMoney: state.budgetData.totalIncome - updatedTotalExpenses,
          availablePercentage: state.budgetData.totalIncome > 0 ? ((state.budgetData.totalIncome - updatedTotalExpenses) / state.budgetData.totalIncome) * 100 : 0,
        },
      };
    }
    
    case 'SET_EDUCATIONAL_CONTENT':
      return { ...state, educationalContent: action.payload };
    
    case 'SET_SELECTED_TEXT':
      return { ...state, selectedText: action.payload };
    
    case 'TOGGLE_ASSISTANT':
      return { ...state, showAssistant: !state.showAssistant };
    
    case 'SET_RISK_PROFILE':
      return {
        ...state,
        budgetData: {
          ...state.budgetData,
        },
        userFinancials: {
          ...(state.userFinancials || {
            ingresos: state.budgetData.totalIncome,
            gastos: state.budgetData.totalExpenses,
            ahorro: state.budgetData.availableMoney,
          }),
          perfilRiesgo: action.payload,
        }
      };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_SHOW_HOME_PAGE':
      return { ...state, showHomePage: action.payload };
    
    case 'SET_AUTH_VIEW':
      return { ...state, currentAuthView: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_TOKEN':
      return { ...state, token: action.payload };

    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    
    case 'SET_ACCOUNT_COUNT':
      return { ...state, accountCount: action.payload };

    case 'SET_TRANSACTION_COUNT':
      return { ...state, transactionCount: action.payload };

    case 'SET_OBLIGATIONS':
      return { ...state, obligations: action.payload };

    case 'SET_OBLIGATION_COUNT':
      return { ...state, obligationCount: action.payload };

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        showHomePage: true,
        currentAuthView: 'home',
        accounts: [],
        accountCount: 0,
      };
    
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [showChat, setShowChat] = useState(false);

  // Restaurar sesión desde localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
      dispatch({ type: 'SET_TOKEN', payload: storedToken });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_SHOW_HOME_PAGE', payload: false });
    }
  }, []);

  // Guardar en localStorage cuando cambia user o token
  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', state.token);
    }
  }, [state.user, state.token]);

  // Funciones auxiliares para manejar autenticación
  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
    if (user) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_SHOW_HOME_PAGE', payload: false });
    }
  };

  const setToken = (token: string | null) => {
    dispatch({ type: 'SET_TOKEN', payload: token });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const setAccounts = (accounts: Account[]) => {
    dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
  };

  const setAccountCount = (count: number) => {
    dispatch({ type: 'SET_ACCOUNT_COUNT', payload: count });
  };

  const setTransactionCount = (count: number) => {
    dispatch({ type: 'SET_TRANSACTION_COUNT', payload: count });
  };

  const setTransactions = (transactions: TransactionTbl[]) => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
  };
  const setObligations = (obligations: Obligations[]) => {
    dispatch({ type: 'SET_OBLIGATIONS', payload: obligations });
  };
  const setObligationCount = (count: number) => {
    dispatch({ type: 'SET_OBLIGATION_COUNT', payload: count });
  };

  // Calcula los datos financieros del usuario para IA
  const userFinancials = {
    ingresos: state.budgetData.totalIncome,
    gastos: state.budgetData.totalExpenses,
    ahorro: state.budgetData.availableMoney,
    perfilRiesgo: state.userFinancials?.perfilRiesgo,
  };

  useEffect(() => {
    // Cargar contenido educativo al iniciar
    fetch('/data/financial-glossary.json')
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'SET_EDUCATIONAL_CONTENT', payload: data });
      })
      .catch(error => {
        console.error('Error loading educational content:', error);
      });
  }, []);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      showChat, 
      setShowChat, 
      userFinancials,
      setUser,
      setToken,
      logout,
      setAccounts,
      setTransactions,
      setAccountCount,
      setTransactionCount,
      setObligations,
      setObligationCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
