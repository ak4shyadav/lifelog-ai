import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Sleep from './pages/Sleep';
import Focus from './pages/Focus';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import './index.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

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
    <div className="flex justify-center bg-black min-h-screen">
      <div className="w-[375px] min-h-screen bg-[#0f0f1a] relative shadow-2xl overflow-hidden">
        <AppProvider>
          {renderPage()}
        </AppProvider>
      </div>
    </div>
  );
}

export default App;
