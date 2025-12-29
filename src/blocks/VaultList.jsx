import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewStars from './ReviewStars'; // Import star component

// === 🎛️ VAULT CONFIGURATION ===
const VAULT_CONFIG = {
  rotationTime: 4000,     // How fast the desktop projector cycles (ms)
  bevelHighlight: 'rgba(255,255,255,0.15)', // Top-left edge color
  bevelShadow: 'rgba(0,0,0,0.8)',      // Bottom-right edge color
  dropShadow: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))'
};

const VaultList = ({ items = [] }) => {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveringList, setIsHoveringList] = useState(false);

  useEffect(() => {
    if (isHoveringList) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, VAULT_CONFIG.rotationTime);
    return () => clearInterval(interval);
  }, [isHoveringList, items.length]);

  if (items.length === 0) return null;

  return (
    <section className="relative z-10 pt-0 pb-32">
      {/* === MOBILE VIEW: COMPACT STACK === */}
      <div className="md:hidden flex flex-col gap-6 px-6">
        {items.map((movie) => (
          <Link 
            to={`/daily/${movie.id}`} 
            key={movie.id}
            // TACTILITY: active:scale-[0.90]
            className="relative aspect-video rounded-3xl overflow-hidden border border-white/20 group transition-transform duration-200 active:scale-[0.90]"
          >
            <img src={movie.poster} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center justify-end h-full">
               <h3 className="font-editorial italic font-bold text-4xl text-white leading-none drop-shadow-xl">{movie.title}</h3>
               
               {/* Metadata with Stars for consistency */}
               <div className="flex flex-col items-center gap-2 mt-2">
                 <div className="text-xs">
                   <ReviewStars rating={movie.rating} isVisible={true} />
                 </div>
                 <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-black">
                   {movie.watchedDate} // Dir. {movie.director}
                 </p>
               </div>
            </div>
          </Link>
        ))}
        <div className="mt-8 text-center">
            <Link to="/vault" className="font-mono text-[10px] font-black tracking-[0.6em] uppercase text-white opacity-50 hover:opacity-100 transition-opacity active:scale-95 inline-block">
                View Full Vault
            </Link>
        </div>
      </div>

      {/* === DESKTOP VIEW: BEVELED LIST === */}
      <div className="hidden md:flex relative z-20 max-w-6xl mx-auto px-16 flex-col items-center pb-60 -mt-5">
        <div 
          className="relative aspect-[2/1] w-full rounded-[3rem] border border-white/10 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
          onMouseEnter={() => setIsHoveringList(true)}
          onMouseLeave={() => {
            setIsHoveringList(false);
            setHoveredMovie(null);
          }}
        >
          {/* POSTER LAYER */}
          <div className="absolute inset-0 z-0">
            {items.map((movie, index) => {
              const isDisplaying = activeIndex === index;
              return (
                <div
                  key={movie.id}
                  className="absolute inset-0 transition-opacity duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                  style={{ opacity: isDisplaying ? 0.6 : 0 }}
                >
                  <img 
                    src={movie.poster} 
                    alt="" 
                    className={`w-full h-full object-cover object-center transition-all duration-1000 
                      ${isHoveringList && isDisplaying ? 'saturate-100 brightness-90' : 'saturate-[0.5] brightness-50'}`} 
                  />
                </div>
              );
            })}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/10 to-black/90" />
          </div>

          {/* LIST LAYER */}
          <div className="relative z-10 flex flex-col h-full justify-center">
            {items.map((movie, index) => {
              const isActuallyHovered = isHoveringList && hoveredMovie?.id === movie.id;
              const isAutoActive = !isHoveringList && activeIndex === index;
              
              let textOpacity = 'opacity-30'; 
              if (isActuallyHovered) textOpacity = 'opacity-100';
              else if (isAutoActive) textOpacity = 'opacity-100';

              return (
                <Link
                  to={`/daily/${movie.id}`}
                  key={movie.id}
                  onMouseEnter={() => {
                    setHoveredMovie(movie);
                    setActiveIndex(index);
                  }}
                  // TACTILITY: active:scale-[0.99] (slight for large rows)
                  className="group flex-1 flex items-center justify-between px-16 border-b border-white/5 last:border-none transition-all duration-500 hover:bg-white/[0.04] active:scale-[0.99]"
                >
                  <div className="flex flex-col gap-1 py-4">
                    <h3 className={`font-editorial text-4xl md:text-6xl font-extrabold italic transition-all duration-500 text-white ${textOpacity}`}
                      style={{ 
                        textShadow: isActuallyHovered || isAutoActive 
                          ? `2px 2px 0px ${VAULT_CONFIG.bevelShadow}, -1px -1px 0px ${VAULT_CONFIG.bevelHighlight}` 
                          : 'none',
                        filter: isActuallyHovered ? VAULT_CONFIG.dropShadow : 'none',
                      }}>
                      {movie.title}
                    </h3>
                    
                    <div className={`flex items-center gap-4 transition-all duration-500 ${textOpacity}`}>
                      <div className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-white">
                        {movie.director} <span className="mx-2 opacity-20">//</span> {movie.year}
                      </div>
                      <div className="text-xs">
                        <ReviewStars rating={movie.rating} isVisible={isActuallyHovered || isAutoActive} />
                      </div>
                    </div>
                  </div>

                  {/* TIMER & WATCHED DATE */}
                  <div className="relative h-full flex items-center justify-end min-w-[150px]">
                    <div className={`text-right transition-all duration-500 ease-out 
                      ${isActuallyHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                      <p className="font-mono text-[9px] font-black tracking-widest text-white/40 uppercase mb-0.5">Watched</p>
                      <p className="font-mono text-base font-black tracking-tighter text-white uppercase drop-shadow-md">
                        {movie.watchedDate}
                      </p>
                    </div>

                    <div className={`absolute right-0 transition-opacity duration-500 ${isAutoActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                        <circle
                          cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="126"
                          className="text-white"
                          style={{
                            animation: isAutoActive ? `vaultCircle ${VAULT_CONFIG.rotationTime}ms linear infinite` : 'none'
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="h-[1px] w-16 bg-white opacity-20" />
          <Link to="/vault" className="font-mono text-[10px] font-black tracking-[0.6em] uppercase text-white opacity-50 hover:opacity-100 transition-opacity active:scale-95">
            View Full Vault
          </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vaultCircle {
          0% { stroke-dashoffset: 126; }
          100% { stroke-dashoffset: 0; }
        }
      `}} />
    </section>
  );
};

export default VaultList;