import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews'; 
import Galaxy from '../blocks/Galaxy'; 

const Reviews = () => {
  const features = reviews.filter(r => r.type === 'feature');

  const SETTINGS = {
    tiltMaxAngle: 5,        
    transitionSpeed: '0.5s',
    hoverLift: '5px',      
    glowColor: '#5227ff',
    glowOpacity: 0.5,       
    tagPosition: 'center',  
    titleOffsetY: '-10px',    
    textParallax: 20,       
    textGlow: '0 0 30px rgba(255,255,255,0.15)', 
    textDropShadow: '0 20px 30px rgba(0,0,0,0.9)',
    galaxy: {
      mouseRepulsion: false,
      mouseInteraction: false,
      density: 0.5,
      glowIntensity: 0.5,
      saturation: 0.8,
      hueShift: 240
    }
  };

  const [tilt, setTilt] = useState({}); 

  const handleMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * SETTINGS.tiltMaxAngle;
    const rotateY = ((x - centerX) / centerX) * SETTINGS.tiltMaxAngle;

    setTilt(prev => ({ ...prev, [id]: { x: rotateX, y: rotateY } }));
  };

  const handleMouseLeave = (id) => {
    setTilt(prev => ({ ...prev, [id]: { x: 0, y: 0 } }));
  };

  const getTagAlignment = () => {
    if (SETTINGS.tagPosition === 'center') return 'justify-center';
    if (SETTINGS.tagPosition === 'right') return 'justify-end';
    return 'justify-start'; 
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-24 relative overflow-hidden">
      
      {/* 1. GALAXY BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <Galaxy {...SETTINGS.galaxy} />
      </div>

      {/* 2. UNIFIED HEADER SECTION */}
      <div className="relative z-10 pt-48 pb-16 px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Metadata Tag */}
          <span className="font-mono text-white/40 text-[10px] uppercase tracking-[0.4em] mb-6 block">
            :: Feature Archive ::
          </span>
          
          {/* Mega Title */}
          <h1 className="font-editorial italic font-bold text-7xl md:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            Reviews
          </h1>
          
          {/* Subheading */}
          <p className="mt-8 font-editorial italic text-white/60 text-lg md:text-xl tracking-wide max-w-2xl mx-auto">
            Professional reviews for new theatrical and streaming films.
          </p>
          
          {/* Unified Glow Bar */}
          <div className="h-1 w-24 mx-auto mt-10 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
        </div>
      </div>

      {/* 3. REVIEWS GRID */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {features.map((item) => {
          const isHovered = !!tilt[item.id]?.x; 

          return (
            <Link 
              to={`/review/${item.id}`} 
              key={item.id}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
              onMouseLeave={() => handleMouseLeave(item.id)}
              style={{
                transformStyle: 'preserve-3d',
                transform: `perspective(1000px) rotateX(${tilt[item.id]?.x || 0}deg) rotateY(${tilt[item.id]?.y || 0}deg) translateY(${isHovered ? `-${SETTINGS.hoverLift}` : '0'})`,
                transition: `transform ${SETTINGS.transitionSpeed} ease-out`,
                borderColor: isHovered ? SETTINGS.glowColor : 'rgba(255,255,255,0.1)'
              }}
              className="group relative aspect-video rounded-[2.5rem] bg-zinc-900 border transition-colors duration-300 hover:z-50"
            >
              {/* Card Glow */}
              <div 
                className="absolute inset-0 rounded-[2.5rem] transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `0 0 60px ${SETTINGS.glowColor}`,
                  opacity: isHovered ? SETTINGS.glowOpacity : 0,
                }}
              />

              {/* Card Media */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]" style={{ transform: 'translateZ(0px)' }}>
                <img 
                  src={item.heroImage} 
                  className="w-full h-full object-cover opacity-60 saturate-50 group-hover:opacity-100 group-hover:saturate-100 transition-all duration-700"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>
              
              {/* Card Content */}
              <div 
                className="absolute inset-0 p-10 flex flex-col justify-end"
                style={{ 
                  transform: isHovered ? `translateZ(${SETTINGS.textParallax}px)` : 'translateZ(0px)',
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* Meta Label */}
                <div className={`absolute top-8 inset-x-0 flex ${getTagAlignment()} px-10`}>
                  <span 
                    className="font-editorial italic text-[12px] uppercase tracking-[0.4em] font-black drop-shadow-md"
                    style={{ color: SETTINGS.glowColor }}
                  >
                    Feature Film
                  </span>
                </div>
                
                {/* Film Title */}
                <h2 
                  className="font-editorial italic font-bold text-5xl text-white leading-tight transition-all duration-500 tracking-tighter"
                  style={{ 
                    marginTop: SETTINGS.titleOffsetY,
                    textShadow: SETTINGS.textGlow,
                    filter: `drop-shadow(${SETTINGS.textDropShadow})`
                  }}
                >
                  {item.title}
                </h2>

                {/* Director/Date/Rating */}
                <div className="flex justify-between items-end mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest font-bold">
                      Dir. {item.director}
                    </p>
                    <p className="font-mono text-[9px] text-white/30 uppercase font-bold">
                      {item.publishedDate}
                    </p>
                  </div>
                  <div className="text-[#FFD700] text-xl font-bold italic drop-shadow-md">
                    {item.ratingStars}
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