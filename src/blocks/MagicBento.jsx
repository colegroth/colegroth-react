import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MagicBento = ({ items }) => {
  const CONFIG = {
    TILT_MAX: 3,            
    IDLE_OPACITY: 0.85,    
    ACCENT: '#5227ff',
    Z_TEXT: 25,              
    Z_QUOTE: 60,            
    HOVER_LIFT: '-10px'      
  };

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({
      x: ((rect.height / 2 - y) / (rect.height / 2)) * CONFIG.TILT_MAX,
      y: ((x - rect.width / 2) / (rect.width / 2)) * CONFIG.TILT_MAX
    });
    setHoveredIndex(index);
  };

  if (!items || items.length === 0) return null;
  const displayItems = items.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-4 pb-20" style={{ perspective: '1200px' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayItems.map((item, index) => {
          const isHero = index === 0;
          const isHovered = hoveredIndex === index;
          const targetRoute = item.type === 'vault' ? '/daily' : '/review';

          return (
            <div 
              key={index}
              className={`relative ${isHero ? 'md:col-span-2 h-[600px]' : 'h-[400px]'}`}
              style={{ perspective: '1200px' }}
            >
              <Link 
                to={`${targetRoute}/${item.id}`} 
                className="relative block w-full h-full"
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHoveredIndex(null); }}
                style={{
                  transformStyle: 'preserve-3d', 
                  transform: isHovered 
                    ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
                    : 'rotateX(0deg) rotateY(0deg)',
                  transition: `transform ${isHovered ? '100ms' : '700ms'} ease-out`
                }}
              >
                {/* IMAGE LAYER */}
                <div 
                  className={`absolute inset-0 z-0 rounded-[3rem] overflow-hidden bg-zinc-900 transition-all duration-500
                    ${isHovered ? `shadow-[0_0_60px_rgba(82,39,255,0.4)]` : ``} 
                  `}
                  style={{
                    border: isHovered ? `6px solid ${CONFIG.ACCENT}` : `2px solid ${CONFIG.ACCENT}33`,
                    transform: 'translateZ(0px)',
                  }}
                >
                  <img 
                    src={item.heroImage} 
                    className={`h-full w-full object-cover transition-all duration-700 
                      ${isHovered ? 'opacity-90 saturate-100' : `opacity-${CONFIG.IDLE_OPACITY} saturate-[0.8]`}`}
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* VERDICT LAYER */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none text-center transition-all duration-1000
                    ${isHovered ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
                  style={{ 
                    transform: `translateZ(${CONFIG.Z_QUOTE}px)`, 
                    padding: '0 15%' 
                  }}
                >
                  <p className={`font-editorial italic font-bold text-white drop-shadow-[0_10px_20px_rgba(0,0,0,1)]
                    ${isHero ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                    "{item.verdict || item.quotes?.[0]}"
                  </p>
                </div>

                {/* TEXT CONTENT LAYER */}
                <div 
                  className={`absolute inset-0 z-10 flex flex-col justify-end pointer-events-none
                    ${isHero ? 'pl-20 pb-16 pr-12' : 'p-10'} 
                  `}
                  style={{ transform: `translateZ(${CONFIG.Z_TEXT}px)` }}
                >
                  <div className="transition-transform duration-500" style={{ transform: isHovered ? `translateY(${CONFIG.HOVER_LIFT})` : 'translateY(0)' }}>
                    <div className="flex items-center gap-3 mb-1">
                      {/* CATEGORY TAG: Now uses a smaller italic editorial font for consistency */}
                      <span className="font-editorial italic text-sm uppercase tracking-widest font-black" style={{ color: CONFIG.ACCENT }}>
                        {item.type === 'vault' ? 'Vault Entry' : 'Feature Review'}
                      </span>
                    </div>
                    
                    {/* FILM TITLE: Consistent Bold Italic Editorial Style */}
                    <h3 className={`font-editorial italic font-bold leading-[0.85] tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,1)]
                      ${isHero ? 'text-8xl' : 'text-5xl'}`}>
                      {item.title}
                    </h3>

                    <div className={`flex justify-between items-end mt-3 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="space-y-0.5">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-white font-black drop-shadow-lg">Dir. {item.director}</p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">{item.publishedDate}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-[#FFD700] text-xl font-bold italic drop-shadow-lg">{item.ratingStars}</span>
                        {/* BUTTON: Switched to font-editorial to match the theme */}
                        {isHero && (
                          <div className="bg-white text-black font-editorial italic font-bold text-sm uppercase px-6 py-3 rounded-full pointer-events-auto shadow-xl">
                            Read {item.type === 'vault' ? 'Dispatch' : 'Review'}
                          </div>
                        )}
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