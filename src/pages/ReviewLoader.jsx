import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews'; 

const ReviewLoader = ({ currentReviewId }) => {
  const archiveItems = useMemo(() => {
    return reviews
      .filter(r => r.id !== currentReviewId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [currentReviewId]);

  if (archiveItems.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-8 py-32 border-t border-white/10">
      <div className="text-center mb-16">
        {/* Consistent Editorial Style */}
        <h4 className="font-editorial italic font-bold text-lg uppercase tracking-[0.4em] text-[#5227ff] drop-shadow-[0_0_15px_rgba(82,39,255,0.6)]">
          From The Archive
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {archiveItems.map((item) => {
          // CLEAN DYNAMIC ROUTING
          const route = item.type === 'feature' ? `/review/${item.id}` : `/daily/${item.id}`;
          
          return (
            <Link 
              to={route} 
              key={item.id}
              className="group relative aspect-video rounded-[2rem] bg-zinc-900 border border-white/10 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-[#5227ff]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                <img 
                  src={item.heroImage} 
                  className="w-full h-full object-cover opacity-60 saturate-[0.8] transition-all duration-700 group-hover:opacity-100 group-hover:saturate-100"
                  alt=""
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#5227ff] mb-2 font-black transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-2">
                  {item.type === 'feature' ? 'FEATURE' : 'VAULT ENTRY'}
                </span>
                
                {/* Unified Editorial Bold Italic */}
                <h5 className="font-editorial italic font-bold text-4xl text-white leading-[0.9] drop-shadow-xl uppercase transition-transform duration-500 group-hover:-translate-y-3">
                  {item.title}
                </h5>

                <div className="absolute bottom-6 flex justify-between items-center w-full px-10 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 delay-75">
                  {/* Updated: "Entry" instead of "Dispatch" */}
                  <span className="font-mono text-[9px] text-white/70 uppercase tracking-widest font-bold">
                    Read {item.type === 'feature' ? 'Feature' : 'Entry'}
                  </span>
                  <span className="text-[#FFD700] text-lg font-bold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                    {item.ratingStars}
                  </span>
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