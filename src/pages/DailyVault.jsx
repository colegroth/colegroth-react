import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews'; 
import DotGrid from '../blocks/DotGrid';
import ReviewStars from '../blocks/ReviewStars';

const VaultItem = ({ item, index, totalCount, SETTINGS, getRatingData, isMobile }) => {
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
  const data = getRatingData(item.ratingStars); 
  const displayEntryNum = totalCount - index;

  // Mobile: Always show stars. Desktop: Show on hover.
  const showStars = isMobile || hasBeenHovered;

  return (
    <Link 
      to={`/daily/${item.id}`} 
      onMouseEnter={() => setHasBeenHovered(true)}
      // Tactile Press
      className="cursor-hover group relative block bg-transparent transition-transform duration-200 active:scale-[0.98] mb-12 md:mb-0"
    >
      {/* MOBILE FIX: Only inject hover styles if we are on DESKTOP.
         This prevents "sticky" hover states on phones.
      */}
      {!isMobile && (
        <style dangerouslySetInnerHTML={{ __html: `
          .vault-card-${item.id}:hover .status-dot { background-color: ${data.color} !important; box-shadow: 0 0 10px ${data.color} !important; }
          .vault-card-${item.id}:hover .vault-title { color: ${data.color} !important; filter: drop-shadow(0 0 ${SETTINGS.textHoverGlowStrength} ${data.color}88) !important; }
          .vault-card-${item.id}:hover .vault-image { filter: grayscale(${SETTINGS.hoverGrayscale}) !important; }
        `}} />
      )}

      <div className={`relative z-10 flex flex-col h-full vault-card-${item.id}`}>
        
        {/* TOP METADATA ROW */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10 group-hover:border-white/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`status-dot w-2 h-2 rounded-full transition-all duration-300 ${isMobile ? 'bg-white' : 'bg-white group-hover:scale-125'}`} />
            <span className={`${SETTINGS.fontData} text-[10px] text-white/40 uppercase tracking-widest group-hover:text-white/70 transition-colors`}>
              Entry No. {String(displayEntryNum).padStart(3, '0')}
            </span>
          </div>
          <span className={`${SETTINGS.fontData} text-[10px] text-white/40 uppercase tracking-widest`}>
            {item.publishedDate}
          </span>
        </div>

        {/* IMAGE */}
        <div className="relative w-full aspect-video mt-4 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 group-hover:border-white/40 transition-colors duration-300">
          <img 
            src={item.heroImage} 
            className="vault-image w-full h-full object-cover transition-all duration-700 ease-out md:group-hover:scale-105" 
            // Mobile: Full Color (0% grayscale). Desktop: Grayscale until hover.
            style={{ filter: isMobile ? 'grayscale(0%)' : `grayscale(${SETTINGS.defaultGrayscale})` }} 
            alt="" 
          />
        </div>

        {/* TITLE & STARS ROW */}
        <div className="pt-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
          
          {/* LEFT: Title & Info */}
          <div className="text-left">
            <h2 className={`vault-title ${SETTINGS.fontTitle} text-3xl md:text-5xl text-white uppercase leading-[0.85] tracking-tighter transition-all duration-300`}>
              {item.title}
            </h2>
            <p className={`${SETTINGS.fontData} text-[10px] text-white/40 mt-3 uppercase tracking-[0.2em]`}>
              Dir. {item.director} // {item.year}
            </p>
          </div>
          
          {/* RIGHT: Stars (Stacked on mobile) */}
          <div className={`text-left md:text-right ${isMobile ? 'order-first md:order-last' : ''}`}>
             <ReviewStars rating={item.ratingStars} isVisible={showStars} className="text-lg md:text-xl" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const DailyVault = () => {
  const vaultItems = useMemo(() => reviews.filter(r => r.type !== 'feature'), []);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SETTINGS = {
    spectrum: { 10: '#00ff41', 9: '#88ff00', 8: '#ccff00', 7: '#eeff00', 6: '#ffff00', 5: '#ffcc00', 4: '#ff9500', 3: '#ff5e00', 2: '#ff0000', 1: '#8b0000', 0: '#ffffff' },
    defaultGrayscale: '65%', 
    hoverGrayscale: '0%', 
    textHoverGlowStrength: '12px', 
    gridGap: 'gap-x-12 gap-y-16', 
    fontData: 'font-mono', 
    fontTitle: "font-editorial italic font-bold", 
  };

  const getRatingData = (stars) => {
    if (!stars) return { color: '#fff' };
    const fullStars = (stars.match(/★/g) || []).length;
    const halfStar = stars.includes('½') ? 0.5 : 0;
    const score = Math.round((fullStars + halfStar) * 2);
    const validScore = Math.max(0, Math.min(10, score));
    return { color: SETTINGS.spectrum[validScore] || '#ffffff' };
  };

  return (
    <div className="bg-[#050505] min-h-screen pb-32 relative overflow-x-hidden">
      
      {/* Background Dots */}
      <div className="fixed inset-0 z-0 opacity-40 h-screen w-screen pointer-events-none">
        <DotGrid dotSize={5} gap={24} baseColor="#333333" activeColor="#5227FF" proximity={100} shockRadius={400} shockStrength={8} resistance={850} returnDuration={1.5} />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-32 md:pt-48 pb-12 md:pb-16 px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <span className="font-mono text-white/40 text-[10px] uppercase tracking-[0.4em] mb-6 block">
            :: Personal Journal ::
          </span>
          <h1 className="font-editorial italic font-bold text-6xl md:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            The Vault
          </h1>
          <p className="mt-8 font-editorial italic text-white/60 text-lg md:text-xl tracking-wide max-w-2xl mx-auto border-l-2 border-[#5227ff] pl-6 text-left">
            A daily log of films watched, rated, and briefly reviewed.
          </p>
          <div className="h-1 w-24 mx-auto mt-10 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
        </div>
      </div>

      {/* Grid */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 ${SETTINGS.gridGap}`}>
        {vaultItems.map((item, index) => (
          <VaultItem 
            key={item.id} 
            item={item} 
            index={index} 
            totalCount={vaultItems.length} 
            SETTINGS={SETTINGS} 
            getRatingData={getRatingData}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyVault;