import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VaultList = ({ items = [] }) => {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveringList, setIsHoveringList] = useState(false);
  const ROTATION_TIME = 6000; 

  useEffect(() => {
    if (isHoveringList) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, ROTATION_TIME);
    return () => clearInterval(interval);
  }, [isHoveringList, items.length]);

  if (items.length === 0) return null;

  return (
    <section className="relative bg-black z-10 pt-0 pb-60">
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} 
        />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-8 md:px-16 flex flex-col items-center pb-60 -mt-5">
        <div 
          className="relative aspect-[2/1] w-full rounded-[3rem] border border-white/10 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
          onMouseEnter={() => setIsHoveringList(true)}
          onMouseLeave={() => {
            setIsHoveringList(false);
            setHoveredMovie(null);
            // The timer will now naturally resume from the activeIndex set during hover
          }}
        >
          {/* POSTER LAYER */}
          <div className="absolute inset-0 z-0">
            {items.map((movie, index) => {
              // We now rely solely on activeIndex for the visual "displaying" state
              // because activeIndex now follows the mouse
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
          <div className="relative z-10 flex flex-col h-full">
            {items.map((movie, index) => {
              const isActuallyHovered = isHoveringList && hoveredMovie?.id === movie.id;
              const isAutoActive = !isHoveringList && activeIndex === index;
              
              let textOpacity = 'opacity-10'; 
              if (isActuallyHovered) textOpacity = 'opacity-100';
              else if (isAutoActive) textOpacity = 'opacity-50';

              return (
                <Link
                  to={`/vault-view?id=${movie.id}`}
                  key={movie.id}
                  onMouseEnter={() => {
                    setHoveredMovie(movie);
                    setActiveIndex(index); // Sync activeIndex to the hovered item immediately
                  }}
                  className="group flex-1 flex items-center justify-between px-16 border-b border-white/5 last:border-none transition-all duration-500 hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className={`font-editorial text-4xl md:text-6xl font-extrabold italic transition-all duration-500 text-white ${textOpacity}`}
                      style={{ 
                        filter: isActuallyHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' : 'none',
                        textShadow: isActuallyHovered ? '1px 1px 0px rgba(255,255,255,0.2), -1px -1px 0px rgba(0,0,0,0.5)' : 'none'
                      }}>
                      {movie.title}
                    </h3>
                    
                    <div className={`font-mono text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 text-white ${textOpacity}`}
                      style={{ filter: isActuallyHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' : 'none' }}>
                      {movie.director} <span className="mx-2 opacity-20">//</span> {movie.year} <span className="mx-2 opacity-20">//</span> {movie.rating}
                    </div>
                  </div>

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
                            animation: isAutoActive ? `vaultCircle ${ROTATION_TIME}ms linear infinite` : 'none'
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
          <Link to="/vault" className="font-mono text-[10px] font-black tracking-[0.6em] uppercase text-white opacity-50 hover:opacity-100 transition-opacity">
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