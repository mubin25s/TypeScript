import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import SplashIntro from './components/SplashIntro';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Guarantee splash clears
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashIntro key="splash" onComplete={handleSplashComplete} />;
  }

  return (
    <div key="main-app-root" style={{
      width: '100%',
      minHeight: '100vh',
      background: '#0a0a0c',
      color: 'white',
      position: 'relative',
      display: 'block'
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
