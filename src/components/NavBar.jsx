import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';

const NavBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    setIsExpanded(!isHome);
    setIsMobileMenuOpen(false);
  }, [location.pathname, isHome]);

  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        const threshold = window.innerWidth < 768 ? 50 : 150;
        if (window.scrollY > threshold) setIsExpanded(true);
        else if (window.scrollY < threshold) setIsExpanded(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Handle Logic: Scroll top if on same page, otherwise normal nav
  const handleLinkClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Vault', path: '/vault' },
    { name: 'About', path: '/about' },
  ];

  const MenuIcon = ({ isOpen }) => (
    <div className="w-6 h-6 grid place-items-center relative">
      <span className={`absolute h-0.5 w-6 bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
      <span className={`absolute h-0.5 w-6 bg-white rounded-full transition-all duration-200 ease-in-out ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} />
      <span className={`absolute h-0.5 w-6 bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
    </div>
  );

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-black/80 to-transparent z-[50] pointer-events-none transition-all duration-700" />
      
      <nav className="fixed top-0 left-0 w-full z-[60] px-6 md:px-12 pt-6 md:pt-8 flex items-center justify-between">
        <div className="flex items-center pointer-events-auto h-12">
          <Link 
            to="/" 
            onClick={(e) => handleLinkClick(e, '/')}
            className={`cursor-hover text-xl md:text-2xl font-black tracking-tighter font-editorial italic transition-all duration-700 mix-blend-difference text-white whitespace-nowrap z-50 active:scale-95 ${(isExpanded || !isHome) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            GROTH ON FILM
          </Link>
        </div>

        <div className="hidden md:flex justify-end flex-1 pl-10">
          <div className={`pointer-events-auto flex flex-row-reverse items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'pl-8 pr-2 py-2' : 'px-2 py-2 w-auto'}`}>
            <button onClick={() => setIsSearchOpen(true)} className="cursor-hover w-10 h-10 flex items-center justify-center text-white/80 hover:text-[#5227ff] transition-all shrink-0 z-20 active:scale-75">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <div className={`h-4 w-px bg-white/20 transition-all duration-500 mx-2 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`} />
            <div className="w-10 h-10 flex items-center justify-center z-20">
              <button onClick={() => setIsExpanded(!isExpanded)} className="cursor-hover w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-75">
                <MenuIcon isOpen={isExpanded} />
              </button>
            </div>
            
            {/* DESKTOP LINKS */}
            <div className={`flex flex-row-reverse gap-2 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'max-w-[600px] opacity-100 mr-4' : 'max-w-0 opacity-0 mr-0'}`}>
              {[...navLinks].reverse().map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={(e) => handleLinkClick(e, link.path)}
                    className={`cursor-hover font-editorial italic font-bold text-lg uppercase tracking-wide transition-all whitespace-nowrap px-4 py-1.5 rounded-full active:scale-95
                      ${isActive 
                        ? 'bg-[#5227ff] text-white shadow-[0_0_15px_rgba(82,39,255,0.4)]' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed top-6 right-6 z-[110] h-12 flex items-center">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="flex items-center justify-center bg-black/80 backdrop-blur-xl border border-white/10 w-12 h-12 rounded-full shadow-xl active:scale-90 transition-transform"
        >
          <MenuIcon isOpen={isMobileMenuOpen} />
        </button>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl transition-all duration-500 flex flex-col items-center justify-center ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col gap-6 text-center px-6 w-full">
          {navLinks.map((link) => {
             const isActive = location.pathname === link.path;
             return (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`font-editorial italic font-bold text-5xl uppercase transition-all duration-300
                  ${isActive ? 'text-[#5227ff] scale-110 drop-shadow-[0_0_20px_rgba(82,39,255,0.5)]' : 'text-white hover:text-white/70'}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NavBar;