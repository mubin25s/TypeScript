import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import SplashIntro from './components/SplashIntro';
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashIntro key="splash" onComplete={handleSplashComplete} />
      ) : (
        <motion.div
          key="main-app-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', minHeight: '100vh' }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:name" element={<PokemonDetail />} />
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
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
