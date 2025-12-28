import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';

const NavBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' }, // Added Home tab
    { name: 'Reviews', path: '/reviews' },
    { name: 'Vault', path: '/vault' }, 
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 p-8 md:p-10 flex justify-between items-start pointer-events-none">
        
        {/* LOGO: PRESERVED AS REQUESTED */}
        <Link 
          to="/" 
          className="text-2xl font-black tracking-tighter font-editorial italic hover:opacity-70 transition-opacity pointer-events-auto mix-blend-difference text-gray"
          style={{ isolation: 'auto' }} 
        >
          GROTH ON FILM
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center bg-black/80 backdrop-blur-xl px-10 py-4 rounded-full border border-white/10 pointer-events-auto shadow-2xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              // Consistent Editorial Bold Italic styling
              className="font-editorial italic font-bold text-lg uppercase tracking-wide text-white/80 hover:text-[#5227ff] hover:opacity-100 transition-all"
            >
              {link.name}
            </Link>
          ))}
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="font-editorial italic font-bold text-lg uppercase tracking-wide border-l border-white/20 pl-8 text-white/80 hover:text-[#5227ff] transition-all cursor-pointer"
          >
            Search
          </button>
        </div>
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default NavBar;