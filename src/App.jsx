import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import DailyVault from './pages/DailyVault';
import ReviewView from './pages/FeatureReview'; 
import VaultReview from './pages/VaultReview'; 
import Reviews from './pages/Reviews'; 
import About from './pages/About';
import NotFound from './pages/NotFound'; 
import PageTransition from './components/PageTransition';
// 1. Remove the CinematicCursor import
import ScrollToTop from './components/ScrollToTop'; 

function App() {
  const location = useLocation();

  const handleDragStart = (e) => e.preventDefault();

  return (
    <div 
      /* 2. Change 'cursor-none' to 'cursor-default' or remove it entirely */
      className="bg-[#0a0a0a] min-h-screen text-white cursor-default selection:bg-[#5227ff]/30"
      onDragStart={handleDragStart}
    >
      <ScrollToTop />
      {/* 3. Remove the <CinematicCursor /> component */}
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/vault" element={<PageTransition><DailyVault /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} /> 
          <Route path="/review/:id" element={<PageTransition><ReviewView /></PageTransition>} />
          <Route path="/daily/:id" element={<PageTransition><VaultReview /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;