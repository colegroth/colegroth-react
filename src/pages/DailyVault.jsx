import React from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews'; 
import DotGrid from '../blocks/DotGrid';

const DailyVault = () => {
  const vaultItems = reviews.filter(r => r.type !== 'feature');

  const SETTINGS = {
    spectrum: {
      10: '#00ff41', 9: '#88ff00', 8: '#ccff00', 7: '#eeff00', 
      6: '#ffff00', 5: '#ffcc00', 4: '#ff9500', 3: '#ff5e00', 
      2: '#ff0000', 1: '#8b0000', 0: '#ffffff'
    },
    defaultGrayscale: '65%', 
    hoverGrayscale: '0%',     
    textHoverGlowStrength: '12px', 
    starColor: '#FFD700',
    starShadow: '0px 1px 4px rgba(0,0,0,0.1)', 
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
      <style>{`
        .star-bevel { color: ${SETTINGS.starColor}; text-shadow: ${SETTINGS.starShadow}; }
      `}</style>

      {/* 1. BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 opacity-40 h-screen w-screen pointer-events-none">
        <DotGrid
          dotSize={5}
          gap={24}
          baseColor="#333333" 
          activeColor="#5227FF"
          proximity={100}
          shockRadius={400}
          shockStrength={8}
          resistance={850}
          returnDuration={1.5}
        />
      </div>

      {/* 2. UNIFIED HEADER SECTION */}
      <div className="relative z-10 pt-48 pb-16 px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Metadata Tag */}
          <span className="font-mono text-white/40 text-[10px] uppercase tracking-[0.4em] mb-6 block">
            :: Personal Journal ::
          </span>
          
          {/* Mega Title */}
          <h1 className="font-editorial italic font-bold text-7xl md:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            The Vault
          </h1>
          
          {/* Subheading */}
          <p className="mt-8 font-editorial italic text-white/60 text-lg md:text-xl tracking-wide max-w-2xl mx-auto border-l-2 border-[#5227ff] pl-6 text-left">
            A daily log of films watched, rated, and briefly reviewed.
          </p>
          
          {/* Unified Glow Bar */}
          <div className="h-1 w-24 mx-auto mt-10 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
        </div>
      </div>

      {/* 3. GRID SECTION */}
      <div className={`relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 ${SETTINGS.gridGap}`}>
        {vaultItems.map((item, index) => {
          const data = getRatingData(item.ratingStars); 
          const displayEntryNum = vaultItems.length - index;

          return (
            <Link 
              to={`/daily/${item.id}`} 
              key={item.id}
              className="group relative block bg-transparent"
            >
              <style dangerouslySetInnerHTML={{ __html: `
                .vault-card-${index}:hover .status-dot { background-color: ${data.color} !important; box-shadow: 0 0 10px ${data.color} !important; }
                .vault-card-${index}:hover .vault-title { color: ${data.color} !important; filter: drop-shadow(0 0 ${SETTINGS.textHoverGlowStrength} ${data.color}88) !important; }
                .vault-card-${index}:hover .vault-image { filter: grayscale(${SETTINGS.hoverGrayscale}) !important; }
              `}} />

              <div className={`relative z-10 flex flex-col h-full vault-card-${index}`}>
                <div className="flex justify-between items-center pb-2 border-b border-white/10 group-hover:border-white/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="status-dot w-2 h-2 rounded-full transition-all duration-300 bg-white group-hover:scale-125" />
                    <span className={`${SETTINGS.fontData} text-[10px] text-white/40 uppercase tracking-widest group-hover:text-white/70 transition-colors`}>
                      Entry No. {String(displayEntryNum).padStart(3, '0')}
                    </span>
                  </div>
                  <span className={`${SETTINGS.fontData} text-[10px] text-white/40 uppercase tracking-widest`}>{item.publishedDate}</span>
                </div>

                <div className="relative w-full aspect-video mt-4 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 group-hover:border-white/40 transition-colors duration-300">
                  <img src={item.heroImage} className="vault-image w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105" style={{ filter: `grayscale(${SETTINGS.defaultGrayscale})` }} alt="" />
                </div>

                <div className="pt-6 flex justify-between items-start">
                  <div className="text-left">
                    <h2 className={`vault-title ${SETTINGS.fontTitle} text-5xl text-white uppercase leading-[0.85] tracking-tighter transition-all duration-300`}>
                      {item.title}
                    </h2>
                    <p className={`${SETTINGS.fontData} text-[10px] text-white/40 mt-3 uppercase tracking-[0.2em]`}>Dir. {item.director} // {item.year}</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xl font-bold font-serif block star-bevel">{item.ratingStars}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DailyVault;