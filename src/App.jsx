import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Sleep from './pages/Sleep';
import Focus from './pages/Focus';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import './index.css';

function MainContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const { state } = useApp();
  const theme = state.theme || 'dark';

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'sleep':
        return <Sleep onBack={() => setActivePage('dashboard')} />;
      case 'focus':
        return <Focus onBack={() => setActivePage('dashboard')} />;
      case 'habits':
        return <Habits onBack={() => setActivePage('dashboard')} />;
      case 'journal':
        return <Journal onBack={() => setActivePage('dashboard')} />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className={`flex justify-center min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'
      }`}>
      <div className={`w-[375px] min-h-screen relative shadow-2xl overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f0f1a] text-white' : 'bg-white text-gray-900'
        }`}>
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
