import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MagicBento from './blocks/MagicBento';
import VaultList from './blocks/VaultList';
import Prism from './blocks/Prism'; 
import ReviewLoader from './pages/ReviewLoader';
import Reviews from './pages/Reviews';
import DailyVault from './pages/DailyVault';
import About from './pages/About';
import { reviews } from './reviews';

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-16 py-10 mix-blend-exclusion text-white pointer-events-none">
    <Link to="/" className="text-3xl font-editorial font-bold tracking-tighter pointer-events-auto cursor-pointer hover:text-accent transition-colors">
      GROTH ON FILM
    </Link>
    
    <div className="hidden md:flex gap-12 font-mono text-[10px] font-bold tracking-[0.3em] uppercase pointer-events-auto">
      <Link to="/" className="hover:text-gray-400">Home</Link>
      {/* Pointing the Nav link to /archive to keep /reviews free for the loader */}
      <Link to="/archive" className="hover:text-gray-400">Reviews</Link>
      <Link to="/vault" className="hover:text-gray-400">The Daily Vault</Link>
      <Link to="/about" className="hover:text-gray-400">About</Link>
    </div>
    
    <div className="pointer-events-auto">
      <div className="text-xs font-mono tracking-widest border-b border-white/40 pb-1 cursor-pointer hover:border-accent">SEARCH</div>
    </div>
  </nav>
);

const Home = () => {
  const featured = reviews.filter(r => r.type === 'feature');
  const vaultItems = reviews.filter(r => r.type === 'vault');
  return (
    <main className="relative z-10">
      <MagicBento items={featured} />
      <VaultList items={vaultItems} />
    </main>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="fixed inset-0 z-0">
         <Prism scale={5} animationType="3drotate" timeScale={0.08} bloom={1.1} noise={0.01} />
      </div>
      
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        {/* LISTEN ON /reviews SO ?id=sinners WORKS */}
        <Route path="/reviews" element={<ReviewLoader />} />
        {/* LIST PAGE MOVED TO /archive */}
        <Route path="/archive" element={<Reviews />} />
        <Route path="/vault" element={<DailyVault />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;