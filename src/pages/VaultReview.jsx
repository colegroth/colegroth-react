import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { reviews } from '../data/reviews'; 
import ReviewStars from '../blocks/ReviewStars';

// === DIRECTION CONTROL ===
const SWIPE_MAP = {
  next: { exit: 'exit-left',  enter: 'enter-right' }, 
  prev: { exit: 'exit-right', enter: 'enter-left' }   
};

// === HELPER: Footer Navigation Card ===
const FooterNavCard = ({ entry, type, onNavClick, allItems, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isNext = type === 'next';
  const idx = allItems.findIndex(r => r.id === entry.id);
  const num = allItems.length - idx;

  return (
    <div 
      onClick={() => onNavClick(entry.id, type)} 
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-row relative w-full h-48 md:h-64 hover:md:h-[28rem] overflow-hidden border-b border-white/10 bg-black transition-all duration-700 cursor-pointer active:scale-[0.95]"
    >
      {/* Directional Arrow Section */}
      <div className={`flex w-[12vw] md:w-[8vw] h-full items-center justify-center transition-colors shrink-0 z-20 
        ${isNext ? 'order-last border-l' : 'order-first border-r'} border-white/10 bg-[#0a0a0a] group-hover:bg-[#5227ff]`}>
        <svg className={`w-6 h-6 md:w-8 md:h-8 text-white transition-transform ${isNext ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isNext ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </div>

      <div className={`relative flex-1 h-full overflow-hidden flex flex-col justify-center px-6 md:px-16 z-10 ${isNext ? 'items-end text-right' : 'items-start text-left'}`}>
        <img 
          src={entry.heroImage} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 
            ${isMobile ? 'opacity-90 saturate-100 blur-[2px]' : 'opacity-60 saturate-[.70] group-hover:opacity-100 group-hover:saturate-100 group-hover:scale-105'}`} 
          alt="" 
        />
        <div className={`absolute inset-0 transition-colors duration-700 ${isMobile ? 'bg-black/40' : 'bg-black/80 group-hover:bg-black/40'}`} />
        
        <div className="relative z-10 w-full flex flex-col items-inherit">
          <div className={`flex items-center gap-2 font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-white/50 mb-2 ${isNext ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-[#5227ff] font-black tracking-widest">{isNext ? "NEXT" : "PREVIOUS"}</span>
            <span className="w-px h-2 bg-white/20" />
            <span>No. {String(num).padStart(3, '0')}</span>
          </div>

          <h2 className="font-editorial italic font-bold text-3xl md:text-6xl text-white uppercase leading-none drop-shadow-lg">{entry.title}</h2>
          
          <div className={`flex items-center gap-3 mt-3 transition-all duration-700 ${isMobile ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} ${isNext ? 'flex-row-reverse' : 'flex-row'}`}>
             <div className="text-sm md:text-xl">
               <ReviewStars rating={entry.ratingStars} isVisible={true} />
             </div>
             <span className="font-mono text-[8px] md:text-[10px] uppercase text-white/60 tracking-widest font-black">Dir. {entry.director}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// === HELPER: Quick Nav Arrow ===
const QuickNavArrow = ({ item, type, onNavClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isNext = type === 'next';

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onNavClick(item.id, type); }} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute ${isNext ? 'right-0 justify-end pr-8' : 'left-0 justify-start pl-8'} top-0 bottom-0 w-48 flex items-center pointer-events-auto cursor-pointer group z-50 transition-transform active:scale-95`}
    >
      <div className={`transition-all duration-500 pointer-events-none whitespace-nowrap ${isHovered ? 'opacity-100 translate-x-0' : `opacity-0 ${isNext ? '-translate-x-4' : 'translate-x-4'}`} ${isNext ? 'mr-6 text-right' : 'ml-6 text-left order-last'}`}>
          <div className={`flex items-center gap-2 mb-1 ${isNext ? 'justify-end' : 'justify-start'}`}>
            {!isNext && <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Previous</span>}
            <div className="text-xs">
              <ReviewStars rating={item.ratingStars} isVisible={isHovered} />
            </div>
            {isNext && <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Next</span>}
          </div>
          <div className="font-editorial italic font-bold text-3xl text-white drop-shadow-2xl">{item.title}</div>
          <div className="font-mono text-[9px] text-white/40 mt-1 uppercase tracking-widest">{item.year} // Dir. {item.director}</div>
      </div>

      <div className="w-14 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-[#5227ff] group-hover:border-[#5227ff] transition-all duration-300 shadow-xl shrink-0">
        <svg className={`w-6 h-6 text-white transform transition-transform ${isHovered ? (isNext ? 'translate-x-1' : '-translate-x-1') : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isNext ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </div>
    </div>
  );
};

// === MAIN SLIDE COMPONENT ===
const ReviewSlide = ({ review, isReading, setIsReading, active, transform, onNavClick, isExiting, isMobile, children }) => {
  const contentRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [starsVisible, setStarsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarsVisible(true), 150);
    return () => clearTimeout(timer);
  }, [review.id]);

  const handleMouseMove = (e) => {
    if (isReading || isExiting || isMobile) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 20; 
    const y = (clientY / height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleContentScroll = (e) => {
    if (contentRef.current && contentRef.current.scrollTop <= 0 && e.deltaY < 0) {
      setIsReading(false);
    }
  };

  if (!review) return null;
  const vaultItems = reviews.filter(r => r.type !== 'feature');
  const currentIndex = vaultItems.findIndex(r => r.id === review.id);
  const currentEntryNum = vaultItems.length - currentIndex;
  const nextItem = currentIndex > 0 ? vaultItems[currentIndex - 1] : null;
  const prevItem = currentIndex < vaultItems.length - 1 ? vaultItems[currentIndex + 1] : null;
  const isVisualReading = isExiting || isReading;

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`absolute inset-0 w-full h-full flex flex-col md:flex-row bg-black text-white ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'} transition-transform duration-[1200ms] will-change-transform ${transform}`} 
      style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
       <div className={`relative transition-all duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden shrink-0 z-30 shadow-[0_10px_60px_rgba(0,0,0,1)] ${isVisualReading ? 'w-full h-[35vh] md:w-[55vw] md:h-screen' : 'w-full h-[100vh] md:w-[100vw]'}`}>
        
        <div className="absolute inset-0 transition-transform duration-100 ease-out will-change-transform" style={{ transform: isMobile ? 'scale(1.1)' : `scale(1.1) translate3d(${mousePos.x * -1.2}px, ${mousePos.y * -1.2}px, 0)` }}>
          <img src={review.heroImage} className={`w-full h-full object-cover transition-all duration-[1100ms] object-[center_20%] ${isVisualReading ? 'opacity-60' : 'opacity-70'}`} alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
        </div>

        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 animate-snap-out transition-all duration-[1100ms]"
          style={{ transform: isMobile ? 'none' : `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
        >
          <div className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-white/70 mb-4">
            NO. {String(currentEntryNum).padStart(3, '0')} <span className="mx-2 text-[#5227ff]">//</span> {review.publishedDate}
          </div>
          
          <div className="text-4xl md:text-6xl mb-6 drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]">
             <ReviewStars rating={review.ratingStars} isVisible={starsVisible} />
          </div>
          
          <h1 className="font-editorial italic font-bold text-5xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tight mb-8 max-w-4xl drop-shadow-2xl">
            {review.title}
          </h1>
          
          <div className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] text-white/60 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
            Dir. {review.director} <span className="mx-2 text-white/20">|</span> {review.year}
          </div>
        </div>

        {!isVisualReading && active && !isMobile && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            {prevItem && <QuickNavArrow item={prevItem} type="prev" onNavClick={onNavClick} />}
            {nextItem && <QuickNavArrow item={nextItem} type="next" onNavClick={onNavClick} />}
          </div>
        )}

        <div className={`absolute bottom-12 left-0 right-0 flex justify-center transition-all duration-[1100ms] ${isVisualReading ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'} z-30`}>
          <button onClick={() => active && setIsReading(true)} className="group flex flex-col items-center gap-3 transition-transform duration-200 active:scale-90">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">Read Entry</span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#5227ff] transition-all"><svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>
          </button>
        </div>
      </div>

      <div className={`relative bg-[#050505] flex flex-col transition-all duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] z-20 ${isVisualReading ? 'w-full h-auto min-h-[65vh] md:w-[45vw] md:h-screen opacity-100' : 'w-full h-0 md:w-0 md:h-screen opacity-0 translate-x-12'}`}>
        {!isMobile && (
          <button onClick={() => setIsReading(false)} className="absolute top-24 right-8 z-[100] p-3 text-white/40 hover:text-white transition-all duration-300 bg-black/40 rounded-full backdrop-blur-md border border-white/10 shadow-2xl active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}

        <div ref={contentRef} onWheel={(!isMobile && active) ? handleContentScroll : undefined} className="flex-1 custom-scrollbar">
          <div className="px-8 md:px-16 pt-16 md:pt-32 pb-8 border-b border-white/10">
            <span className="bg-[#5227ff] px-3 py-1 rounded text-white font-bold font-mono text-[10px] uppercase tracking-widest w-fit shadow-[0_0_20px_rgba(82,39,255,0.4)]">The Verdict</span>
            <h2 className="font-editorial italic font-bold text-3xl md:text-5xl leading-tight text-white/90 mt-5">"{review.verdict}"</h2>
          </div>
          <div className="px-8 md:px-16 py-12 prose prose-invert prose-lg leading-relaxed text-gray-300 font-light tracking-wide">
            {review.paragraphs?.map((p, i) => (<p key={i} dangerouslySetInnerHTML={{ __html: p }} className="mb-8" />))}
          </div>
          {children} 
        </div>
      </div>
    </div>
  );
};

const VaultReview = () => {
  const { id: routeId } = useParams(); 
  const [activeId, setActiveId] = useState(routeId);
  const [outgoingId, setOutgoingId] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [animState, setAnimState] = useState('idle');
  const [outgoingAnimState, setOutgoingAnimState] = useState('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const vaultItems = reviews.filter(r => r.type !== 'feature');
  const currentIndex = vaultItems.findIndex(r => r.id === activeId); 
  const currentItem = vaultItems[currentIndex];
  const nextEntry = currentIndex > 0 ? vaultItems[currentIndex - 1] : null;
  const prevEntry = currentIndex < vaultItems.length - 1 ? vaultItems[currentIndex + 1] : null;

  const handleNavClick = (targetId, type) => {
    if (isAnimating) return;
    setOutgoingId(activeId);
    setOutgoingAnimState('idle'); 
    setActiveId(targetId);
    setAnimState(SWIPE_MAP[type].enter);
    setIsReading(false); 
    setIsAnimating(true);
    window.history.pushState(null, '', `/daily/${targetId}`);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOutgoingAnimState(SWIPE_MAP[type].exit);
        setAnimState('idle');
      });
    });

    setTimeout(() => { setIsAnimating(false); setOutgoingId(null); }, 1250); 
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating || isReading) return; 
      if (e.key === 'ArrowRight' && nextEntry) handleNavClick(nextEntry.id, 'next');
      if (e.key === 'ArrowLeft' && prevEntry) handleNavClick(prevEntry.id, 'prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeId, isAnimating, isReading, nextEntry, prevEntry]);

  useEffect(() => {
    const handleGlobalWheel = (e) => {
      if (isAnimating || isReading || isMobile) return;
      if (e.deltaY > 0) setIsReading(true);
    };
    window.addEventListener('wheel', handleGlobalWheel);
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, [isReading, isAnimating, isMobile]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <style>{`
        @keyframes snapOut {
          0% { transform: scale(1.15) translateZ(60px); opacity: 0; filter: blur(15px); }
          25% { transform: scale(1.08) translateZ(30px); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1) translateZ(0px); }
        }
        .animate-snap-out { animation: snapOut 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; perspective: 1000px; }
      `}</style>

      {outgoingId && (
        <ReviewSlide review={reviews.find(r => r.id === outgoingId)} isReading={isReading} isExiting={true} active={false} transform={getPageTransform(outgoingAnimState)} onNavClick={()=>{}} isMobile={isMobile} />
      )}

      <ReviewSlide review={currentItem} isReading={isReading} setIsReading={setIsReading} active={!isAnimating} transform={getPageTransform(animState)} onNavClick={handleNavClick} isMobile={isMobile}>
        <div className="w-full flex flex-col border-t border-white/10 pb-20">
          {nextEntry && <FooterNavCard entry={nextEntry} type="next" onNavClick={handleNavClick} allItems={vaultItems} isMobile={isMobile} />}
          {prevEntry && <FooterNavCard entry={prevEntry} type="prev" onNavClick={handleNavClick} allItems={vaultItems} isMobile={isMobile} />}
          <div className="py-20 bg-black text-center border-t border-white/5">
             <Link to="/vault" className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20 active:scale-95 inline-block">[ Back to Index ]</Link>
          </div>
        </div>
      </ReviewSlide>
    </div>
  );
};

const getPageTransform = (state) => {
  switch (state) {
    case 'idle': return 'translate-x-0 opacity-100 scale-100';
    case 'exit-left': return '-translate-x-full opacity-0 scale-95';
    case 'exit-right': return 'translate-x-full opacity-0 scale-95';
    case 'enter-left': return '-translate-x-full opacity-0 scale-100';
    case 'enter-right': return 'translate-x-full opacity-0 scale-100';
    default: return 'translate-x-0';
  }
};

export default VaultReview;