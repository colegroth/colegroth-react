import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews';
import ReviewStars from '../blocks/ReviewStars';

const SearchResultCard = ({ item, onClose, isMobile, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const linkTo = item.type === 'vault' ? `/daily/${item.id}` : `/review/${item.id}`;
  const showStars = isMobile || isHovered;

  return (
    <Link
      to={linkTo}
      onClick={onClose}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden border border-white/10 transition-all duration-500 cursor-pointer active:scale-[0.98] opacity-0
        ${isMobile ? 'aspect-[21/9] rounded-xl' : 'aspect-video rounded-2xl hover:border-[#5227ff]/50 hover:scale-[1.02]'}`}
      style={{
        animation: `fadeInUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards`,
        animationDelay: `${index * 80}ms`
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={item.heroImage} 
          alt={item.title}
          className={`w-full h-full object-cover transition-all duration-700
            ${isMobile ? 'opacity-50 saturate-100' : 'opacity-60 group-hover:opacity-40 group-hover:scale-105 saturate-0 group-hover:saturate-100'}`}
        />
        {!isMobile && (
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none mix-blend-overlay" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${isMobile ? 'from-black via-black/60 to-transparent' : 'from-black via-black/50 to-transparent'}`} />
      </div>

      <div className={`absolute inset-0 flex flex-col justify-between ${isMobile ? 'p-4' : 'p-6 justify-end'}`}>
        {isMobile && (
          <div className="flex justify-between items-start">
            <span className="font-mono text-[8px] text-[#5227ff] uppercase tracking-widest bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              {item.type === 'vault' ? 'Vault' : 'Review'}
            </span>
            <div className="text-sm"><ReviewStars rating={item.ratingStars} isVisible={true} /></div>
          </div>
        )}

        <div className={`${!isMobile && 'transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500'}`}>
          {!isMobile && (
            <div className="flex justify-between items-end mb-2">
              <span className="font-mono text-[9px] text-[#5227ff] uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 group-hover:bg-[#5227ff] group-hover:text-white transition-colors">
                {item.type === 'vault' ? 'Vault' : 'Review'}
              </span>
              <div className="text-lg drop-shadow-md">
                 <ReviewStars rating={item.ratingStars} isVisible={showStars} />
              </div>
            </div>
          )}
          
          <h3 className={`font-editorial text-white italic font-bold leading-none drop-shadow-xl truncate transition-colors
            ${isMobile ? 'text-2xl' : 'text-3xl group-hover:text-[#5227ff]'}`}>
            {item.title}
          </h3>
          
          <p className={`font-mono text-white/70 mt-1 uppercase tracking-wider
            ${isMobile ? 'text-[9px]' : 'text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500'}`}>
            Dir. {item.director} // {item.year}
          </p>
        </div>
      </div>
    </Link>
  );
};

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      document.body.style.overflow = 'auto';
      setQuery('');
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const lowerQuery = query.toLowerCase();
      const filtered = reviews.filter(
        (r) =>
          r.title.toLowerCase().includes(lowerQuery) ||
          r.director.toLowerCase().includes(lowerQuery) ||
          (r.verdict && r.verdict.toLowerCase().includes(lowerQuery))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-[#050505] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      
      {/* 1. DYNAMIC BACKGROUND ENGINE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Aurora Gradient */}
        <div 
          className="absolute inset-[-50%] opacity-20 bg-[radial-gradient(circle_at_50%_50%,#5227ff_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#ff00ff_0%,transparent_40%)]"
          style={{
            animation: 'slowRotate 30s linear infinite',
          }}
        />
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />
      </div>

      <style>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* 2. TOP BAR */}
      <div className={`relative z-10 flex p-6 md:p-10 ${isMobile ? 'justify-start' : 'justify-end'}`}>
        <button 
          onClick={onClose}
          className="cursor-hover group flex items-center gap-3 text-white/50 hover:text-white transition-all active:scale-90"
        >
          <span className={`font-editorial italic font-bold text-3xl md:text-4xl group-hover:text-[#5227ff] transition-all ${isMobile ? 'order-2' : 'order-1'}`}>CLOSE</span>
          <span className={`hidden md:inline font-mono text-[10px] tracking-[0.3em] uppercase transition-colors ${isMobile ? 'order-1' : 'order-2'}`}>ESC</span>
        </button>
      </div>

      {/* 3. SEARCH INTERFACE */}
      <div className="relative z-10 flex-1 flex flex-col items-center pt-4 px-6 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-4xl mb-12">
          <input
            type="text"
            placeholder="Search the Archive..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 text-4xl md:text-8xl font-editorial italic font-bold text-white placeholder-white/5 focus:outline-none focus:border-[#5227ff] py-6 text-center transition-all duration-500"
            autoFocus
          />
        </div>

        {/* 4. RESULTS */}
        <div className="w-full max-w-5xl pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {results.map((item, index) => (
              <SearchResultCard 
                key={`${item.id}-${query}`} 
                item={item} 
                onClose={onClose} 
                isMobile={isMobile} 
                index={index}
              />
            ))}
          </div>
          
          {query.length > 1 && results.length === 0 && (
            <div className="text-center mt-20 opacity-0 animate-in fade-in duration-700 fill-mode-forwards">
              <p className="font-editorial text-3xl text-white/20 italic tracking-tight uppercase">Records not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;