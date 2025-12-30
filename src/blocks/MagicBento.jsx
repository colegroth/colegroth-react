import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import ReviewStars from './ReviewStars';
import { optimizeImage } from '../utils/image';

const MagicBento = memo(({ items }) => {
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
    
    // 3D Tilt Logic
    const xRot = ((rect.height / 2 - y) / (rect.height / 2)) * 3;
    const yRot = ((x - rect.width / 2) / (rect.width / 2)) * 3;

    setTilt({ x: xRot, y: yRot });
    setHoveredIndex(index);
  };

  if (!items || items.length === 0) return null;
  const displayItems = items.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-4 pb-20" style={{ perspective: '1200px' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {displayItems.map((item, index) => {
          const isHero = index === 0;
          const isHovered = !isMobile && hoveredIndex === index;
          const showMetadata = isMobile || isHovered;
          const targetRoute = item.type === 'vault' ? '/daily' : '/review';
          const optimizedUrl = optimizeImage(item.heroImage, 1280);

          return (
            <div 
              key={item.id || index} 
              className={`relative ${isHero ? 'md:col-span-2 h-[400px] md:h-[600px]' : 'h-[300px] md:h-[400px]'}`}
            >
              <Link 
                to={`${targetRoute}/${item.id}`}
                className="relative block w-full h-full transition-all duration-700 ease-out active:scale-[0.98]"
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => {
                  setTilt({ x: 0, y: 0 });
                  setHoveredIndex(null);
                }}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isHovered 
                    ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
                    : 'rotateX(0deg) rotateY(0deg)',
                }}
              >
                {/* IMAGE CONTAINER & FULL BORDER */}
                <div 
                  className={`absolute inset-0 z-0 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden bg-black transition-all duration-500 border
                    ${isHovered ? 'border-[#5227ff]/60 shadow-[0_0_40px_rgba(82,39,255,0.3)]' : 'border-white/10'}`}
                  style={{ transform: 'translateZ(0px)' }}
                >
                  <img 
                    src={optimizedUrl} 
                    className={`h-full w-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-105 saturate-110' : 'opacity-80 scale-100 saturate-[0.85]'}`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-20'}`} />
                </div>

                {/* TAG - SEAMLESS CONNECTION */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                  style={{ transform: 'translateZ(0px)' }}
                >
                  <div className={`px-5 py-2 rounded-b-xl border-x border-b backdrop-blur-xl font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 -mt-[1px]
                    ${isHovered 
                      ? 'bg-[#5227ff]/20 border-[#5227ff]/60 text-white shadow-[0_0_20px_rgba(82,39,255,0.4)]' 
                      : 'bg-black/60 border-white/10 text-white/70'}`}
                  >
                    {item.type === 'vault' ? ':: Daily Log' : ':: Feature Review'}
                  </div>
                </div>

                {/* VERDICT */}
                {!isMobile && (
                  <div 
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none text-center transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transform: `translateZ(80px)`, padding: '0 5%' }}
                  >
                    <p className="font-editorial italic font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,1)] text-lg md:text-2xl whitespace-nowrap w-full">
                      "{item.verdict}"
                    </p>
                  </div>
                )}

                {/* TEXT CONTENT */}
                <div 
                  className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col justify-end z-20 pointer-events-none"
                  style={{ transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)' }}
                >
                  <div className={`transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showMetadata ? 'translate-y-0' : 'translate-y-[3rem]'}`}>
                    <h2 className="font-editorial italic font-bold text-4xl md:text-7xl text-white leading-[0.85] tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                      {item.title}
                    </h2>
                  </div>

                  <div className={`flex justify-between items-end mt-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showMetadata ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="space-y-0.5">
                      <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-white font-black drop-shadow-md">
                        Dir. {item.director}
                      </p>
                      <p className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold">
                        {item.publishedDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 text-lg md:text-2xl drop-shadow-md">
                       <ReviewStars rating={item.ratingStars} isVisible={showMetadata} />
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
});

export default MagicBento;