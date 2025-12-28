import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GridScan } from './GridScan'; 

const VaultList = ({ items = [] }) => {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const ROTATION_TIME = 4000;

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, ROTATION_TIME);
    return () => clearInterval(interval);
  }, [isHovering, items.length]);

  if (items.length === 0) return null;

  return (
    <section className="relative bg-black z-10 pt-40 pb-60">
      <div className="absolute -top-64 left-0 w-full h-64 z-20 pointer-events-none bg-gradient-to-b from-transparent to-black" />

      {/* BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
               backgroundSize: '40px 40px',
             }} />
        <div className="absolute inset-0 opacity-30 mix-blend-screen">
          <GridScan 
            linesColor="#1a1a1a"
            scanColor="#ffffff"
            scanOpacity={0.15}
            gridScale={0.2}
            noiseIntensity={0.01}
            scanDuration={4}
          />
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-8 md:px-16 flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex items-center gap-8 mb-12 opacity-30">
          <h2 className="font-mono text-[10px] font-bold tracking-[0.5em] uppercase text-white">
            The Daily Vault
          </h2>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* THE UNIFIED LIGHT BOX */}
        <div 
          className="relative aspect-[2/1] w-full rounded-[2.5rem] border border-white/10 bg-zinc-950/40 backdrop-blur-sm overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredMovie(null);
          }}
        >
          {/* IMAGE LAYER */}
          <div className="absolute inset-0 z-0">
            {items.map((movie, index) => {
              const isDisplaying = hoveredMovie ? hoveredMovie.id === movie.id : activeIndex === index;
              return (
                <div
                  key={movie.id}
                  className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: isDisplaying ? 0.4 : 0 }}
                >
                  <img 
                    src={movie.poster} 
                    alt="" 
                    className={`w-full h-full object-cover object-center transition-all duration-1000 
                      ${isHovering ? 'grayscale-0 brightness-100' : 'grayscale brightness-50'}`} 
                  />
                </div>
              );
            })}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-black/60" />
          </div>

          {/* INTERACTIVE ROWS: The Stack */}
          <div className="relative z-10 flex flex-col h-full">
            {items.map((movie, index) => {
              const isSelected = isHovering ? hoveredMovie?.id === movie.id : activeIndex === index;
              
              return (
                <Link
                  to={`/reviews?id=${movie.id}`}
                  key={movie.id}
                  onMouseEnter={() => setHoveredMovie(movie)}
                  className="group flex-1 flex items-center justify-between px-12 border-b border-white/5 last:border-none transition-all duration-500 hover:bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                >
                  <div className="flex flex-col gap-1">
                    {/* Text Shadows & Opacity Logic */}
                    <h3 className={`font-editorial text-3xl md:text-5xl font-bold italic transition-all duration-500 drop-shadow-lg
                      ${isSelected && isHovering ? 'text-white' : (isSelected ? 'text-white/40' : 'text-white/10')}`}>
                      {movie.title}
                    </h3>
                    
                    <div className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-500 drop-shadow-md
                      ${isSelected && isHovering ? 'text-accent' : (isSelected ? 'text-accent/20' : 'text-white/5')}`}>
                      {movie.director} <span className="mx-2 opacity-10">//</span> {movie.year} <span className="mx-2 opacity-10">//</span> {movie.rating}
                    </div>
                  </div>

                  <div className={`text-right transition-all duration-500 ease-out drop-shadow-md ${hoveredMovie?.id === movie.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                     <p className="font-mono text-[9px] font-bold tracking-widest text-white/40 uppercase mb-1">Watched</p>
                     <p className="font-mono text-base font-bold tracking-widest text-white">{movie.watchedDate}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* PROGRESS BAR: Raised Z-index and opacity */}
          <div className={`absolute bottom-0 left-0 h-1.5 bg-accent z-50 transition-opacity duration-500 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
               style={{ 
                 width: '100%',
                 transformOrigin: 'left',
                 animation: !isHovering ? `vaultProgress ${ROTATION_TIME}ms linear infinite` : 'none'
               }} />
        </div>

        {/* 5. VIEW FULL VAULT BUTTON */}
        <Link 
          to="/vault" 
          className="mt-12 group flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all duration-500"
        >
          <div className="h-[1px] w-12 bg-white transition-all duration-500 group-hover:w-24" />
          <span className="font-mono text-[10px] font-bold tracking-[0.5em] uppercase text-white">View Full Vault</span>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vaultProgress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}} />
    </section>
  );
};

export default VaultList;