import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Simple redirect to a search results page (logic can be added later)
    if (searchQuery.trim()) {
      navigate(`/reviews?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 mix-blend-difference text-white">
      {/* 1. LOGO LINKS HOME */}
      <Link to="/" className="font-editorial text-2xl md:text-3xl italic font-bold tracking-tighter hover:text-accent transition-colors duration-300">
        GROTH ON FILM
      </Link>

      {/* 2. CENTERED NAVIGATION LINKS */}
      <div className="hidden md:flex items-center gap-10 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
        <Link to="/" className="hover:text-accent transition-colors duration-300">Home</Link>
        <Link to="/reviews" className="hover:text-accent transition-colors duration-300">Reviews</Link>
        <Link to="/daily-vault" className="hover:text-accent transition-colors duration-300">The Daily Vault</Link>
        <Link to="/about" className="hover:text-accent transition-colors duration-300">About</Link>
      </div>

      {/* 3. SEARCH BAR */}
      <form onSubmit={handleSearch} className="flex items-center border-b border-white/40 focus-within:border-accent transition-colors duration-300">
        <input 
          type="text" 
          placeholder="SEARCH" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none font-mono text-[10px] uppercase tracking-[0.2em] placeholder:text-white/50 w-24 focus:w-48 transition-all duration-500 text-white pb-1"
        />
        <button type="submit" className="ml-2 pb-1 text-white/60 hover:text-accent">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </nav>
  );
};

export default Navbar;