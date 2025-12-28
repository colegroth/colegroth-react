import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import './MagicBento.css';

const DEFAULT_GLOW_COLOR = '255, 255, 255';

const BentoCard = ({ movie, isMain, glowColor }) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const element = cardRef.current;
    const content = contentRef.current;
    const badge = badgeRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // TILT REDUCED BY 25%: Multiplier dropped to 2.25
      const rotateX = ((y - centerY) / centerY) * -2.25;
      const rotateY = ((x - centerX) / centerX) * 2.25;

      gsap.to(element, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 1200 });

      // PARALLAX REDUCED BY 40%: Hero now 4.5, Bottom now 1.8
      const parallaxPower = isMain ? 4.5 : 1.8;
      
      if (content) {
        gsap.to(content, {
          x: ((x - centerX) / centerX) * parallaxPower,
          y: ((y - centerY) / centerY) * parallaxPower,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      
      if (badge) {
        gsap.to(badge, {
          x: ((x - centerX) / centerX) * (parallaxPower * 1.5),
          y: ((y - centerY) / centerY) * (parallaxPower * 1.5),
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.6 });
      if (content) gsap.to(content, { x: 0, y: 0, duration: 0.6 });
      if (badge) gsap.to(badge, { x: 0, y: 0, duration: 0.6 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMain]);

  const textStyle = {
    WebkitTextStroke: '0.5px rgba(255,255,255,0.25)',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0px rgba(255,255,255,0.05)'
  };

  return (
    <Link 
      to={`/reviews?id=${movie.id}`}
      ref={cardRef}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-black block w-full group shadow-2xl"
      style={{ aspectRatio: '16/9', transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${movie.poster})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

      {isMain && (
        <div className="absolute top-10 left-0 w-full flex justify-center z-20 pointer-events-none" style={{ perspective: '1200px' }}>
          <div ref={badgeRef} style={{ transform: 'translateZ(90px)' }}>
            <span className="px-4 py-1 text-[10px] font-bold font-mono uppercase tracking-[0.2em] border border-white/40 text-white rounded-full bg-black/40 backdrop-blur-md shadow-2xl">
              Featured Review
            </span>
          </div>
        </div>
      )}

      <div 
        ref={contentRef}
        className="absolute bottom-0 left-0 z-20 w-full flex flex-col items-center text-center px-6 pb-6"
        style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }} 
      >
        <h2 className={`${isMain ? 'text-6xl mb-0' : 'text-3xl mb-0'} font-editorial font-bold italic text-white drop-shadow-2xl`} 
            style={textStyle}>
          {movie.title}
        </h2>
        
        <p className="font-mono text-accent text-[18px] font-bold tracking-[0.3em] mb-0 drop-shadow-2xl">
          {movie.rating}
        </p>

        <p className="font-mono text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1">
          {movie.director} // {movie.year}
        </p>

        <p className={`font-editorial font-semibold text-gray-200 italic leading-tight max-w-2xl truncate w-full ${isMain ? 'text-lg whitespace-normal line-clamp-2 mt-2' : 'text-[11px] whitespace-nowrap overflow-hidden text-ellipsis mt-1'}`}
           style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          "{movie.quote}"
        </p>
      </div>
    </Link>
  );
};

const MagicBento = ({ items = [] }) => {
  const heroFeature = items[0];
  const subFeatures = items.slice(1, 3);
  if (!heroFeature) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col gap-10">
      <BentoCard movie={heroFeature} isMain={true} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {subFeatures.map((movie) => (
          <BentoCard key={movie.id} movie={movie} isMain={false} />
        ))}
      </div>
    </div>
  );
};

export default MagicBento;