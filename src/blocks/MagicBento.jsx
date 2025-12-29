import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// === 🎛️ GLOBAL CONFIGURATION ===
const CONFIG = {
  // --- 🪄 Interaction & 3D ---
  tiltMax: 1.5,           
  parallaxDepth: 90,     
  zoomScale: 1.03,        
  perspective: 2000,      
  
  // --- 🎨 Aesthetics ---
  accentColor: '#5227ff',
  idleOpacity: 0.85,
  hoverOpacity: 0.65,
  blurAmount: '4px',
  grainOpacity: 0.15,     
  starGlow: 'rgba(255, 215, 0, 0.5)',
  
  // --- ⏱️ Animation Timing ---
  transitionDuration: '950ms',
  easing: 'cubic-bezier(0.2, 1, 0.3, 1)',
  starStagger: 70,        
  
  // --- 📏 Vertical Spacing (Desktop) ---
  heroPaddingBottom: 'pb-16',
  subCardPaddingBottom: 'pb-10',
  moveUpAmount: '-translate-y-5', 
  tagToVerdictGap: 'mb-4',
  verdictToTitleGap: 'mb-4',
  
  // --- 📱 Mobile Constraints ---
  mobileTagTop: 'top-8',
  mobilePaddingBottom: 'pb-10',
};

const MagicBento = ({ items }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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
      x: ((rect.height / 2 - y) / (rect.height / 2)) * CONFIG.tiltMax,
      y: ((x - rect.width / 2) / (rect.width / 2)) * CONFIG.tiltMax
    });
    setHoveredIndex(index);
  };

  const renderStars = (ratingString, isHovered) => {
    if (!ratingString) return null;
    return ratingString.split('').map((char, i) => (
      <span 
        key={i} 
        className="text-[#FFD700] inline-block"
        style={{ 
          transition: `all 0.8s ${CONFIG.easing}`,
          transitionDelay: isHovered ? `${i * CONFIG.starStagger}ms` : '0ms',
          transform: isHovered ? 'scale(1.15) rotate(360deg)' : 'scale(0) rotate(0deg)',
          opacity: isHovered ? 1 : 0,
          filter: isHovered ? `drop-shadow(0 0 12px ${CONFIG.starGlow})` : 'none'
        }}
      >
        {char}
      </span>
    ));
  };

  if (!items || items.length === 0) return null;
  const displayItems = items.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-4 pb-20" style={{ perspective: `${CONFIG.perspective}px` }}>
      <svg className="hidden">
        <filter id="film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {displayItems.map((item, index) => {
          const isHero = index === 0;
          const isHovered = !isMobile && hoveredIndex === index;
          const targetRoute = item.type === 'feature' ? '/review' : '/daily';

          return (
            <div 
              key={index}
              className={`relative ${isHero ? 'md:col-span-2 h-[50vh] min-h-[450px] md:h-[600px]' : 'h-[350px] md:h-[400px]'}`}
            >
              <Link 
                to={`${targetRoute}/${item.id}`} 
                // TACTILITY: Individual card scaling on press
                className="relative block w-full h-full transition-transform duration-200 active:scale-[0.98]"
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHoveredIndex(null); }}
                style={{
                  transformStyle: 'preserve-3d', 
                  transform: isHovered 
                    ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
                    : 'rotateX(0deg) rotateY(0deg)',
                  transition: `transform ${isHovered ? '200ms' : '1000ms'} ease-out`
                }}
              >
                {/* === IMAGE LAYER === */}
                <div 
                  className={`absolute inset-0 z-0 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-zinc-950 transition-all duration-700
                    ${isHovered ? `shadow-[0_0_60px_rgba(82,39,255,0.2)]` : ``} 
                  `}
                  style={{
                    border: `1.5px solid ${CONFIG.accentColor}${isHovered ? '66' : '11'}`,
                    transform: 'translateZ(0px)',
                  }}
                >
                  <img 
                    src={item.heroImage} 
                    className="h-full w-full object-cover transition-all duration-1000"
                    style={{ 
                      filter: isHovered ? `blur(${CONFIG.blurAmount})` : 'none',
                      opacity: isHovered ? CONFIG.hoverOpacity : CONFIG.idleOpacity,
                      transform: isHovered ? `scale(${CONFIG.zoomScale})` : 'scale(1)'
                    }}
                    alt="" 
                  />
                  
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{ 
                      opacity: isHovered ? CONFIG.grainOpacity : 0,
                      filter: 'url(#film-grain)',
                      backgroundColor: 'white',
                      mixBlendMode: 'overlay'
                    }}
                  />

                  <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* === FIXED MOBILE TAG === */}
                  {isMobile && (
                    <div className={`absolute ${CONFIG.mobileTagTop} left-0 right-0 z-20 flex justify-center pointer-events-none`}>
                      <span className="font-editorial italic text-xs uppercase tracking-widest font-black px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full shadow-lg" style={{ color: CONFIG.accentColor }}>
                        {item.type === 'vault' ? 'Vault Entry' : 'Feature Review'}
                      </span>
                    </div>
                  )}

                {/* === TEXT CONTENT LAYER === */}
                <div 
                  className={`absolute inset-0 z-10 flex flex-col pointer-events-none justify-end
                    ${isMobile ? `px-6 ${CONFIG.mobilePaddingBottom}` : (isHero ? `px-12 ${CONFIG.heroPaddingBottom}` : `p-8 ${CONFIG.subCardPaddingBottom}`)}
                  `}
                  style={{ 
                    transform: `translateZ(${isMobile ? 0 : CONFIG.parallaxDepth}px)`,
                    transition: `transform 500ms ${CONFIG.easing}`
                  }}
                >
                  <div className="relative w-full flex flex-col justify-end">
                    <div className={`transition-all duration-[900ms] ${CONFIG.easing} ${!isMobile && isHovered ? CONFIG.moveUpAmount : 'translate-y-0'}`}>
                      
                      {!isMobile && (
                        <div className={`flex items-center ${CONFIG.tagToVerdictGap} pl-2`}>
                          <span className="px-4 py-1.5 rounded-full border text-[9px] uppercase tracking-[0.25em] font-black italic bg-black/50 backdrop-blur-md" 
                                style={{ color: CONFIG.accentColor, borderColor: `${CONFIG.accentColor}44` }}>
                            {item.type === 'vault' ? 'Vault Entry' : 'Feature Review'}
                          </span>
                        </div>
                      )}

                      {!isMobile && item.verdict && (
                        <div className={`overflow-hidden transition-all duration-700 ${CONFIG.easing} pl-2 w-full`}
                             style={{ 
                               maxHeight: isHovered ? '80px' : '0px',
                               opacity: isHovered ? 1 : 0,
                               marginBottom: isHovered ? '1rem' : '0px'
                             }}>
                          <p className="font-editorial italic text-xl lg:text-2xl text-white whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-xl">
                            "{item.verdict}"
                          </p>
                        </div>
                      )}

                      <h3 className={`font-editorial italic font-bold tracking-tighter text-white break-words leading-[0.85]
                        ${isMobile ? 'text-center text-5xl mb-1' : 'text-left drop-shadow-2xl'}
                        ${!isMobile && (isHero ? 'text-8xl' : 'text-5xl')}
                      `}>
                        {item.title}
                      </h3>
                    </div>

                    <div className={`transition-all duration-700 ${CONFIG.easing} mt-3
                      ${isMobile ? 'flex justify-center' : `flex justify-between relative pl-2`}
                      ${!isMobile && (isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                    `}>
                      <div className="space-y-0 text-center md:text-left">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/90 font-black">
                          Dir. {item.director}
                          {isMobile && <span className="text-[#FFD700] ml-3 text-sm font-bold italic">{item.ratingStars}</span>}
                        </p>
                      </div>
                      
                      {!isMobile && (
                        <div className="flex items-center gap-1.5 text-2xl" style={{ transform: 'translateZ(20px)' }}>
                           {renderStars(item.ratingStars, isHovered)}
                        </div>
                      )}
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