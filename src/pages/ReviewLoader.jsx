import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient'; 
import ReviewStars from '../blocks/ReviewStars';

const ReviewLoader = ({ currentReviewId }) => {
  const TAG_OFFSET = "1px"; 
  const [items, setItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // FIX: State must be here, NOT inside the map
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Fetch mix of features and vault
      const data = await client.fetch(`
        *[_type in ["featureReview", "vaultReview"]] | order(publishedDate desc)[0...12] {
          _id,
          _type,
          id,
          title,
          director,
          ratingStars,
          heroImage
        }
      `);
      setItems(data);
    };
    fetchSuggestions();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const archiveItems = useMemo(() => {
    return items
      .filter(r => r.id !== currentReviewId && r._id !== currentReviewId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [items, currentReviewId]);

  if (archiveItems.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-32 border-t border-white/5 relative">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <span className="font-mono text-[10px] text-[#5227ff] uppercase tracking-[0.4em] mb-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-[0_0_20px_rgba(82,39,255,0.15)]">
          Read Next
        </span>
        <h4 className="font-editorial italic font-bold text-5xl md:text-7xl text-white uppercase tracking-tighter">
          From The Archive
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {archiveItems.map((item) => {
          const isFeature = item._type === 'featureReview';
          // Fix logic: Use 'id' for features, '_id' for vault
          const route = isFeature ? `/review/${item.id}` : `/daily/${item._id}`;
          
          // FIX: Check against parent state
          const isHovered = hoveredId === item._id;
          const showMetadata = isMobile || isHovered;
          
          const imgSrc = item.heroImage || 'https://via.placeholder.com/800x600?text=No+Image';

          return (
            <div 
              key={item._id}
              className="relative aspect-[4/3] md:aspect-[3/4] lg:aspect-video"
              onMouseEnter={() => setHoveredId(item._id)} // FIX: Set ID
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link 
                to={route} 
                className="cursor-hover block w-full h-full rounded-[2rem] bg-black transition-all duration-500 active:scale-[0.90] relative"
              >
                <div className={`absolute inset-0 overflow-hidden rounded-[2rem] border transition-all duration-500 z-10 ${isHovered ? 'border-[#5227ff]/60 shadow-[0_0_40px_rgba(82,39,255,0.3)]' : 'border-white/10'}`}>
                  <img 
                    src={imgSrc}
                    className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-105 saturate-110' : 'opacity-80 scale-100 saturate-[0.85]'}`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-20'}`} />
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ marginTop: TAG_OFFSET }}>
                  <div className={`px-3 py-1.5 rounded-b-lg border-x border-b backdrop-blur-xl font-mono text-[8px] uppercase tracking-[0.2em] transition-all duration-500 -mt-[1px]
                    ${isHovered ? 'bg-[#5227ff]/20 border-[#5227ff]/60 text-white shadow-[0_0_20px_rgba(82,39,255,0.4)]' : 'bg-black/60 border-white/10 text-white/70'}`}>
                    {isFeature ? 'Feature Film' : 'Vault Entry'}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end z-20 overflow-hidden rounded-b-[2rem]">
                  <div className={`transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showMetadata ? 'translate-y-0' : 'translate-y-[2.2rem]'}`}>
                    <h3 className="font-editorial text-white italic font-bold text-2xl md:text-3xl leading-[0.9] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] mb-1">
                      {item.title}
                    </h3>
                    <div className={`flex justify-between items-end transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showMetadata ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="space-y-0">
                         <p className="font-mono text-[7px] text-white/90 uppercase tracking-widest font-black drop-shadow-md">
                           Dir. {item.director}
                         </p>
                      </div>
                      <div className="text-base drop-shadow-md">
                        <ReviewStars rating={item.ratingStars} isVisible={showMetadata} />
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

export default ReviewLoader;