import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import Header from './components/Header';
import Footer from './components/Footer';

// Page imports (will create these next)
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import WorkerRegistration from './pages/WorkerRegistration';
import ContractorRegistration from './pages/ContractorRegistration';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register/worker" element={<WorkerRegistration />} />
        <Route path="/register/contractor" element={<ContractorRegistration />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </AnimatePresence>
  );
};

import ScrollToTop from './components/ScrollToTop';

// ... (imports)

import { LocationProvider } from './context/LocationContext';
import LocationPrompt from './components/LocationPrompt';

// ... (imports)

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LocationProvider>
          <Router>
            <ScrollToTop />
            <LocationPrompt />
            <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1 }}>
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
