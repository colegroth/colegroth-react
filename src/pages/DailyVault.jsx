import React from 'react';
import { Link } from 'react-router-dom';
import Aurora from '../blocks/Aurora';

const DailyVault = () => {
  // Use the same archive path as the Features page
  const modules = import.meta.glob('./archive/*.js', { eager: true });
  
  // Filter for 'daily' in the filename to isolate Palm Springs
  const reviews = Object.entries(modules)
    .filter(([path]) => path.toLowerCase().includes('daily'))
    .map(([_, module]) => module.default)
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono overflow-x-hidden relative">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
         <Aurora colorStops={["#5227ff", "#ff9ffc", "#5227ff"]} speed={0.1} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <header className="mb-20 border-b border-white/10 pb-12">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#5227ff] mb-4 font-bold">Daily Entries</p>
          <h1 className="font-editorial text-[10rem] italic font-bold text-white leading-none tracking-tighter">
            The Vault.
          </h1>
        </header>

        {/* High-Contrast Database Header */}
        <div className="grid grid-cols-12 gap-4 text-[9px] uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-4 mb-6 px-4 font-black">
          <div className="col-span-2 text-[#5227ff]">ID_DATE</div>
          <div className="col-span-7">ENTRY_TITLE</div>
          <div className="col-span-3 text-right">SCORE</div>
        </div>

        {/* Entry List */}
        <div className="space-y-1">
          {reviews.map((review, i) => (
            <Link 
              key={i} 
              to={`/reviews?id=${review.title.replace(/\s+/g, '-').toLowerCase()}`}
              className="grid grid-cols-12 gap-4 items-center p-8 bg-white/[0.02] border border-white/5 hover:border-[#5227ff]/40 hover:bg-white/[0.04] transition-all group"
            >
              <div className="col-span-2 text-[10px] text-zinc-500 font-bold group-hover:text-white transition-colors">
                {review.publishedDate}
              </div>
              
              <div className="col-span-7 flex items-center gap-10">
                 {/* Cinematic Thumbnail */}
                 <div className="w-20 h-24 bg-zinc-900 overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                    <img 
                      src={review.heroImage} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                      alt="" 
                    />
                 </div>
                 <div>
                    <span className="font-editorial text-6xl italic text-white group-hover:text-[#5227ff] transition-colors leading-none tracking-tighter">
                      {review.title}
                    </span>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] mt-3 group-hover:text-zinc-400">
                      Dir. {review.director} // {review.year}
                    </p>
                 </div>
              </div>

              <div className="col-span-3 text-right">
                <div className="text-[#FFD700] text-lg tracking-[0.3em] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] font-bold italic">
                  {review.ratingStars}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyVault;