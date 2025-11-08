import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { BudgetData, BudgetEntry, EducationalContent } from '../types';

interface AppState {
  currentView: string;
  budgetData: BudgetData;
  educationalContent: EducationalContent | null;
  selectedText: string;
  showAssistant: boolean;
  isAuthenticated: boolean;
  showHomePage: boolean;
  currentAuthView: 'home' | 'login' | 'register' | 'forgot-password';
  userFinancials?: {
    ingresos: number;
    gastos: number;
    ahorro: number;
    perfilRiesgo?: string;
  };
}

interface AppAction {
  type: 'SET_VIEW' | 'UPDATE_BUDGET' | 'SET_EDUCATIONAL_CONTENT' | 'SET_SELECTED_TEXT' | 'TOGGLE_ASSISTANT' | 'ADD_INCOME' | 'ADD_EXPENSE' | 'REMOVE_INCOME' | 'REMOVE_EXPENSE' | 'SET_RISK_PROFILE' | 'SET_AUTHENTICATED' | 'SET_SHOW_HOME_PAGE' | 'SET_AUTH_VIEW';
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
}>({
  state: initialState,
  dispatch: () => null,
  showChat: false,
  setShowChat: () => {},
  userFinancials: undefined,
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
    
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [showChat, setShowChat] = useState(false);

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
    <AppContext.Provider value={{ state, dispatch, showChat, setShowChat, userFinancials }}>
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
