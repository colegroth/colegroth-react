import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import DailyVault from './pages/DailyVault';
import ReviewView from './pages/FeatureReview'; 
import VaultReview from './pages/VaultReview'; 
import Reviews from './pages/Reviews'; 
import About from './pages/About';

function App() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Main Listing Pages */}
        <Route path="/vault" element={<DailyVault />} />
        <Route path="/reviews" element={<Reviews />} /> 
        
        {/* Dynamic Detail Pages with Clean Paths */}
        <Route path="/review/:id" element={<ReviewView />} />
        <Route path="/daily/:id" element={<VaultReview />} />
        
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;