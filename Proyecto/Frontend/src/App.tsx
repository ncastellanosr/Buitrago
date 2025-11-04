import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BudgetCalculator from './components/BudgetCalculator';
import Investments from './components/Investments';
import StockPrices from './components/StockPrices';
import FinancialNews from './components/FinancialNews';
import EducationalAssistant from './components/EducationalAssistant';
import './App.css'
import { Bot, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { state, dispatch, showChat, setShowChat } = useApp();

  // Detectar selección de texto para el asistente educativo
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const selectedText = selection.toString().trim().toLowerCase();
        dispatch({ type: 'SET_SELECTED_TEXT', payload: selectedText });
        
        // Verificar si el texto seleccionado es un término financiero
        if (state.educationalContent?.terms[selectedText]) {
          dispatch({ type: 'TOGGLE_ASSISTANT' });
        }
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, [state.educationalContent, dispatch]);

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'budget':
        return <BudgetCalculator />;
      case 'investments':
        return <Investments />;
      case 'stocks':
        return <StockPrices />;
      case 'news':
        return <FinancialNews />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          {renderCurrentView()}
        </main>
      </div>
      {state.showAssistant && (
        <EducationalAssistant 
          selectedText={state.selectedText}
          onClose={() => dispatch({ type: 'TOGGLE_ASSISTANT' })}
        />
      )}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-40"
        onClick={() => setShowChat(!showChat)}
      >
        { showChat ? (<X />) : (<Bot />) }
      </button>
      <div className={`fixed bottom-20 right-4 z-50${showChat ? '' : ' hidden'}`}>
        <iframe
          src="https://udify.app/chatbot/qiv19sTK9weNweoy"
          className="w-[400px] md:w-[500px] h-[500px] border-none rounded-2xl shadow-lg bg-gradient-to-br from-blue-700 to-cyan-600"
          allow="microphone"
        >
        </iframe>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
