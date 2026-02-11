import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import SplashIntro from './components/SplashIntro';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashIntro key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <div key="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pokemon/:name" element={<PokemonDetail />} />
            </Routes>
          </div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
