import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MagicBento = ({ items }) => {
  const CONFIG = {
    TILT_MAX: 4,
    IDLE_OPACITY: 0.85,
    ACCENT: '#5227ff',
    Z_TEXT: 40,
    Z_QUOTE: 90,
    HOVER_LIFT: '-12px',
    STAR_STAGGER: 70,
    PERSPECTIVE: '1500px'
  };

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e, index) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({
      x: ((rect.height / 2 - y) / (rect.height / 2)) * CONFIG.TILT_MAX,
      y: ((x - rect.width / 2) / (rect.width / 2)) * CONFIG.TILT_MAX
    });
    setHoveredIndex(index);
  };

  const renderStars = (ratingString, active) => {
    if (!ratingString) return null;
    return ratingString.split('').map((char, i) => (
      <span 
        key={i} 
        className="text-[#FFD700] inline-block drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
        style={{ 
          transition: `all 0.6s cubic-bezier(0.2, 1, 0.3, 1)`,
          transitionDelay: active ? `${i * CONFIG.STAR_STAGGER}ms` : '0ms',
          transform: active ? 'scale(1.1) rotate(360deg)' : 'scale(0) rotate(0deg)',
          opacity: active ? 1 : 0
        }}
      >
        {char}
      </span>
    ));
  };

  if (!items || items.length === 0) return null;
  const displayItems = items.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-4 pb-20" style={{ perspective: CONFIG.PERSPECTIVE }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {displayItems.map((item, index) => {
          const isHero = index === 0;
          const isHovered = !isMobile && hoveredIndex === index;
          const targetRoute = item.type === 'vault' ? '/daily' : '/review';

          return (
            <div 
              key={index}
              className={`relative ${isHero ? 'md:col-span-2 h-[400px] md:h-[600px]' : 'h-[300px] md:h-[400px]'}`}
            >
              <Link 
                to={`${targetRoute}/${item.id}`} 
                className="relative block w-full h-full transition-all duration-700 active:scale-[0.98]"
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHoveredIndex(null); }}
                style={{
                  transformStyle: 'preserve-3d', 
                  transform: isHovered 
                    ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
                    : 'rotateX(0deg) rotateY(0deg)',
                  transition: `transform ${isHovered ? '250ms' : '1000ms'} cubic-bezier(0.2, 1, 0.3, 1)`
                }}
              >
                {/* IMAGE LAYER */}
                <div 
                  className={`absolute inset-0 z-0 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden bg-zinc-950 transition-all duration-1000 ease-[cubic-bezier(0.2, 1, 0.3, 1)]
                    ${isHovered ? `shadow-[0_0_70px_rgba(82,39,255,0.4)]` : ``} 
                  `}
                  style={{
                    // Idle border is now 1.5px and 30% opacity for better visibility
                    border: isHovered ? `2px solid ${CONFIG.ACCENT}` : `1.5px solid ${CONFIG.ACCENT}4D`,
                    transform: 'translateZ(0px)',
                  }}
                >
                  <img 
                    src={item.heroImage} 
                    className={`h-full w-full object-cover transition-all duration-[1000ms] cubic-bezier(0.2, 1, 0.3, 1)
                      ${isHovered ? 'opacity-90 saturate-100 scale-105' : `opacity-${CONFIG.IDLE_OPACITY} saturate-[0.8]`}`}
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                {/* VERDICT LAYER */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none text-center transition-all duration-[800ms]
                    ${isHovered ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
                  style={{ 
                    transform: `translateZ(${CONFIG.Z_QUOTE}px)`, 
                    padding: '0 15%' 
                  }}
                >
                  <p className={`font-editorial italic font-bold text-white drop-shadow-[0_10px_30px_rgba(0,0,0,1)]
                    ${isHero ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                    "{item.verdict || (item.paragraphs && item.paragraphs[0].substring(0, 60) + "...")}"
                  </p>
                </div>

                {/* TEXT CONTENT LAYER */}
                <div 
                  className={`absolute inset-0 z-10 flex flex-col justify-end pointer-events-none
                    ${isHero ? 'px-8 md:px-20 pb-10 md:pb-16' : 'p-6 md:p-10'} 
                  `}
                  style={{ transform: `translateZ(${CONFIG.Z_TEXT}px)` }}
                >
                  <div className="transition-transform duration-[800ms] cubic-bezier(0.2, 1, 0.3, 1)" style={{ transform: isHovered ? `translateY(${CONFIG.HOVER_LIFT})` : 'translateY(0)' }}>
                    
                    <div className="flex items-center mb-4">
                      <span className="bg-black/60 backdrop-blur-md border border-white/20 text-[#5227ff] font-editorial italic font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                        {item.type === 'vault' ? 'Vault Entry' : 'Feature Review'}
                      </span>
                    </div>
                    
                    <h3 className={`font-editorial italic font-bold leading-[0.85] tracking-tighter text-white drop-shadow-[0_10px_40px_rgba(0,0,0,1)]
                      ${isHero ? 'text-5xl md:text-8xl' : 'text-3xl md:text-5xl'}`}>
                      {item.title}
                    </h3>

                    <div className={`flex justify-between items-end mt-3 transition-all duration-[800ms] ${isHovered || isMobile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="space-y-0.5">
                        <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-white font-black drop-shadow-lg">Dir. {item.director}</p>
                        <p className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">{item.publishedDate}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-0.5 text-lg md:text-2xl">
                           {renderStars(item.ratingStars, isHovered || isMobile)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBento;