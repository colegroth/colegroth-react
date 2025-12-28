import React from 'react';
import { Link } from 'react-router-dom';
import Aurora from '../blocks/Aurora';

const Reviews = () => {
  // Pull from the archive folder
  const modules = import.meta.glob('./archive/*.js', { eager: true });
  
  // Filter based on the filename strings you identified
  const reviewsList = Object.entries(modules)
    .filter(([path]) => path.toLowerCase().includes('feature')) // ONLY FILES WITH 'FEATURE' IN NAME
    .map(([_, module]) => module.default);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-32 relative">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <Aurora colorStops={["#5227ff", "#ff9ffc", "#5227ff"]} speed={0.2} />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="font-editorial text-9xl italic font-bold mb-24 tracking-tighter">Features.</h1>

        <div className="space-y-40">
          {reviewsList.map((review, i) => (
            <Link 
              key={i} 
              to={`/reviews?id=${review.title.replace(/\s+/g, '-').toLowerCase()}`} 
              className="group block"
            >
              <div className="aspect-[21/9] overflow-hidden rounded-sm mb-10 border border-white/10 group-hover:border-accent transition-colors duration-500">
                 <img 
                   src={review.heroImage} 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
                   alt={review.title}
                 />
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-8">
                <div>
                  <h2 className="font-editorial text-7xl italic group-hover:text-accent transition-colors">
                    {review.title}
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mt-4">
                    Dir. {review.director} // {review.year}
                  </p>
                </div>
                <div className="text-[#FFD700] text-2xl tracking-widest font-bold italic">
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

export default Reviews;