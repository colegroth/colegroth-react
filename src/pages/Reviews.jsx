import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient'; 
import ReviewStars from '../blocks/ReviewStars';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMobile, setIsMobile] = useState(false);
  const [tilt, setTilt] = useState({});

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        // Fetch all feature reviews
        const data = await client.fetch(`*[_type == "featureReview"]`);
        
        // Sort by Date (Newest First) in JS to handle text-based dates properly
        data.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        
        setReviews(data);
      } catch (e) {
        console.error("Archive fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleFeatures = useMemo(() => reviews.slice(0, visibleCount), [reviews, visibleCount]);

  const handleMouseMove = useCallback((e, id) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 3;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
    setTilt(prev => ({ ...prev, [id]: { x: rotateX, y: rotateY } }));
  }, [isMobile]);

  const handleLoadMore = () => setVisibleCount(prev => prev + 12);

  if (loading) return <div className="min-h-screen bg-[#050505] pt-40 text-center text-white/50 font-mono uppercase tracking-widest">Loading Archive...</div>;

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

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {visibleFeatures.map((item) => {
          const isHovered = !!tilt[item.id]?.x;
          const showMetadata = isMobile || isHovered;
          
          // Image fallback
          const imgSrc = item.heroImage || 'https://via.placeholder.com/1280x720?text=No+Image';

          return (
            <Link 
              to={`/review/${item.id}`} 
              key={item.id}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
              onMouseLeave={() => setTilt(prev => ({ ...prev, [item.id]: { x: 0, y: 0 } }))}
              className="cursor-hover group relative aspect-video rounded-[1.5rem] md:rounded-[2.5rem] bg-black transition-all duration-500 active:scale-[0.98] overflow-hidden will-change-transform"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isMobile 
                  ? 'none' 
                  : `perspective(1000px) rotateX(${tilt[item.id]?.x || 0}deg) rotateY(${tilt[item.id]?.y || 0}deg)`,
              }}
            >
              <div 
                className={`absolute inset-0 bg-black transition-all duration-500 border ${isHovered ? 'border-[#5227ff]/60 shadow-[0_0_40px_rgba(82,39,255,0.3)]' : 'border-white/10'}`}
                style={{ transform: 'translateZ(0px)' }}
              >
                <img 
                  src={imgSrc} 
                  className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-105 saturate-110' : 'opacity-80 scale-100 saturate-[0.85]'}`}
                  alt={item.title}
                  loading="lazy"
                />
              </div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ transform: 'translateZ(0px)' }}>
                <div className={`px-3 py-1.5 rounded-b-lg border-x border-b backdrop-blur-xl font-mono text-[8px] uppercase tracking-[0.2em] transition-all duration-500 -mt-[1px]
                  ${isHovered ? 'bg-[#5227ff]/20 border-[#5227ff]/60 text-white shadow-[0_0_20px_rgba(82,39,255,0.4)]' : 'bg-black/60 border-white/10 text-white/70'}`}>
                  :: Feature Film
                </div>
              </div>

              <div 
                className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-col justify-end"
                style={{ transform: (!isMobile && isHovered) ? 'translateZ(40px)' : 'translateZ(0px)' }}
              >
                <h2 className={`font-editorial italic font-bold text-2xl md:text-4xl text-white uppercase leading-[0.85] tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showMetadata ? 'translate-y-0' : 'translate-y-[2.5rem]'}`}>
                  {item.title}
                </h2>
                <div className={`flex justify-between items-end mt-3 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showMetadata ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <div className="space-y-0.5">
                    <p className="font-mono text-[7px] md:text-[9px] text-white uppercase tracking-widest font-black drop-shadow-md">
                      Dir. {item.director}
                    </p>
                    <p className="font-mono text-[6px] md:text-[8px] text-white/50 uppercase font-bold">
                      {item.publishedDate}
                    </p>
                  </div>
                  <div className="text-base md:text-xl drop-shadow-md">
                    <ReviewStars rating={item.ratingStars} isVisible={showMetadata} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {visibleCount < reviews.length && (
        <div className="relative z-20 flex justify-center mt-20">
          <button onClick={handleLoadMore} className="cursor-hover group relative px-8 py-3 rounded-full border border-white/20 bg-black/50 backdrop-blur-md overflow-hidden transition-all active:scale-95 hover:border-[#5227ff]">
            <div className="absolute inset-0 bg-[#5227ff] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white group-hover:text-[#5227ff] transition-colors">Load More</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;