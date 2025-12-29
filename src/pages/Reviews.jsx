import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews'; 
import ReviewStars from '../blocks/ReviewStars';

// === 🎛️ MANUAL VISUAL CONTROL PANEL (Fixed for Raw CSS) ===
const VISUAL_CONFIG = {
  desktop: {
    // USE RAW CSS VALUES (px, rem, or %)
    titleStart: '40px',    // Lower starting position
    titleEnd: '10px',     // Where it lifts to on hover
    
    // Image Filters (Idle)
    idleBrightness: 0.8,   // 0 to 1
    idleSaturation: .8,     // 0 = B&W, 1 = Full Color
    idleBlur: '0px',
    
    // Image Filters (Hover)
    hoverBrightness: 1,
    hoverSaturation: 1,
    hoverBlur: '0px',
  },
  mobile: {
    titlePosition: '5px', 
    brightness: 1,
    saturation: 1,
    blur: '0px',
    textShadow: '0 4px 12px rgba(0,0,0,0.9)',
  },
  general: {
    titleDropShadow: '0 10px 20px rgba(0,0,0,1)',
  }
};

const Reviews = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    const handleResize = () => setIsMobile(checkMobile());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = useMemo(() => reviews.filter(r => r.type === 'feature'), []);
  const [tilt, setTilt] = useState({}); 

  const handleMouseMove = (e, id) => {
    if (isMobile) return; 
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 4;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
    setTilt(prev => ({ ...prev, [id]: { x: rotateX, y: rotateY } }));
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#050505]"> 
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(82,39,255,0.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 pt-48 pb-20 px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <span className="font-mono text-white/40 text-[10px] uppercase tracking-[0.4em] mb-6 block">
            :: Feature Archive ::
          </span>
          <h1 className="font-editorial italic font-bold text-6xl md:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-2xl">
            Reviews
          </h1>
          <div className="h-0.5 w-24 mx-auto mt-12 bg-[#5227ff] shadow-[0_0_30px_#5227ff]" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
        {features.map((item, index) => {
          const isHovered = !!tilt[item.id]?.x; 

          return (
            <Link 
              to={`/review/${item.id}`} 
              key={item.id}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
              onMouseLeave={() => setTilt(prev => ({ ...prev, [item.id]: { x: 0, y: 0 } }))}
              className="cursor-hover group relative aspect-video rounded-[1.5rem] md:rounded-[2.5rem] bg-zinc-900 border border-white/5 transition-all duration-500 active:scale-[0.98] overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                transform: isMobile ? 'none' : `perspective(1000px) rotateX(${tilt[item.id]?.x || 0}deg) rotateY(${tilt[item.id]?.y || 0}deg)`,
                animation: `fadeInUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards`,
                animationDelay: `${index * 150}ms`,
                opacity: 0 
              }}
            >
              <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>

              {/* IMAGE LAYER */}
              <div className="absolute inset-0">
                <img 
                  src={item.heroImage} 
                  className="w-full h-full object-cover transition-all duration-1000 ease-out"
                  style={{ 
                    filter: isMobile 
                      ? `brightness(${VISUAL_CONFIG.mobile.brightness}) saturate(${VISUAL_CONFIG.mobile.saturation}) blur(${VISUAL_CONFIG.mobile.blur})`
                      : isHovered 
                        ? `brightness(${VISUAL_CONFIG.desktop.hoverBrightness}) saturate(${VISUAL_CONFIG.desktop.hoverSaturation}) blur(${VISUAL_CONFIG.desktop.hoverBlur})`
                        : `brightness(${VISUAL_CONFIG.desktop.idleBrightness}) saturate(${VISUAL_CONFIG.desktop.idleSaturation}) blur(${VISUAL_CONFIG.desktop.idleBlur})`
                  }}
                  alt="" 
                />
              </div>

              {!isMobile && (
                <div className="absolute top-[-2px] inset-x-0 flex justify-center z-20">
                  <div className="px-4 py-1.5 bg-white/5 backdrop-blur-md border-x border-b border-white/10 rounded-b-2xl">
                     <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-black italic text-[#5227ff]">
                       Feature Film
                     </span>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end">
                {/* TITLE */}
                <h2 className="font-editorial italic font-bold text-2xl md:text-5xl text-white leading-[0.85] tracking-tighter transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ 
                      filter: `drop-shadow(${VISUAL_CONFIG.general.titleDropShadow})`,
                      transform: `translateY(${isMobile ? VISUAL_CONFIG.mobile.titlePosition : isHovered ? VISUAL_CONFIG.desktop.titleEnd : VISUAL_CONFIG.desktop.titleStart})`
                    }}>
                  {item.title}
                </h2>

                {/* METADATA */}
                <div className={`flex justify-between items-end mt-2 md:mt-4 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${!isMobile && isHovered ? 'translate-y-0 opacity-100' : isMobile ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                `}>
                  <div className="space-y-0.5">
                    <p className="font-mono text-[8px] md:text-[11px] text-white uppercase tracking-widest font-black" style={{ filter: isMobile ? `drop-shadow(${VISUAL_CONFIG.mobile.textShadow})` : 'none' }}>
                      Dir. {item.director}
                    </p>
                    <p className="font-mono text-[7px] md:text-[9px] text-white/40 uppercase font-bold">
                      {item.publishedDate}
                    </p>
                  </div>

                  <div className="text-lg md:text-2xl transform transition-transform duration-500">
                     <ReviewStars rating={item.ratingStars} isVisible={true} />
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

export default Reviews;