import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import DailyLog from './pages/DailyLog';
import ReviewView from './pages/FeatureReview'; 
import DailyReview from './pages/DailyReview'; 
import Reviews from './pages/Reviews'; 
import About from './pages/About';
import NotFound from './pages/NotFound'; 
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop'; 
import { Analytics } from '@vercel/analytics/react';

function App() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // === 1. SPUNKY TAB TITLE HANDLER ===
  useEffect(() => {
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "🍿 We're paused...";
      } else {
        document.title = originalTitle;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // === 2. LIGHT/DARK MODE LOGIC ===
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDragStart = (e) => e.preventDefault();

  return (
    <div 
      onDragStart={handleDragStart}
      className="bg-white dark:bg-[#0a0a0a] min-h-screen text-black dark:text-white cursor-default selection:bg-[#5227ff]/30 transition-colors duration-300"
    >
      <ScrollToTop />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/daily-log" element={<PageTransition><DailyLog /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} /> 
          <Route path="/review/:id" element={<PageTransition><ReviewView /></PageTransition>} />
          <Route path="/daily/:id" element={<PageTransition><DailyReview /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {/* TRACKS PAGE VIEWS ACROSS ALL ROUTES */}
      <Analytics />
    </div>
  );
}

export default App;