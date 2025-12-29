import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews'; 
import ReviewStars from '../blocks/ReviewStars'; 

const ReviewLoader = ({ currentReviewId }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const archiveItems = useMemo(() => {
    return reviews
      .filter(r => r.id !== currentReviewId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [currentReviewId]);

  if (archiveItems.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-32 border-t border-white/5 relative">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <span className="font-mono text-[10px] text-[#5227ff] uppercase tracking-[0.4em] mb-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-[0_0_20px_rgba(82,39,255,0.15)]">Read Next</span>
        <h4 className="font-editorial italic font-bold text-5xl md:text-7xl text-white uppercase tracking-tighter">From The Archive</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {archiveItems.map((item) => {
          const route = item.type === 'feature' ? `/review/${item.id}` : `/daily/${item.id}`;
          const [isHovered, setIsHovered] = useState(false);
          const showStars = isMobile || isHovered;

          return (
            <Link 
              to={route} 
              key={item.id}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              // ADDED: active:scale-[0.98]
              className="cursor-hover group relative aspect-[4/3] md:aspect-[3/4] lg:aspect-video rounded-[2rem] bg-zinc-900 border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#5227ff]/40 active:scale-[0.98]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img src={item.heroImage} className="w-full h-full object-cover opacity-60 md:opacity-40 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105" alt="" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col items-center text-center">
                <div className="mt-2 transition-transform duration-500 group-hover:-translate-y-1">
                  <span className="px-3 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-[0.25em] font-black italic bg-black/40 backdrop-blur-md text-[#5227ff] group-hover:bg-[#5227ff] group-hover:text-white transition-all">
                    {item.type === 'feature' ? 'Feature Film' : 'Vault Entry'}
                  </span>
                </div>
                <div className="flex-1" />
                <div className={`w-full flex flex-col items-center gap-3 transition-all duration-500 ${!isMobile && isHovered ? '-translate-y-2' : 'translate-y-0'}`}>
                  <h5 className="font-editorial italic font-bold text-3xl md:text-4xl text-white leading-[0.85] uppercase max-w-[90%] drop-shadow-2xl">{item.title}</h5>
                  <div className={`flex items-center gap-4 transition-all duration-500 ${!isMobile && !isHovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">{item.year}</span>
                    <div className="text-sm"><ReviewStars rating={item.ratingStars} isVisible={showStars} /></div>
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

export default ReviewLoader;