import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { reviews } from '../data/reviews'; // Or your Sanity client later
import ReviewStars from '../blocks/ReviewStars';

const SWIPE_MAP = {
  next: { exit: 'exit-left',  enter: 'enter-right' }, 
  prev: { exit: 'exit-right', enter: 'enter-left' }   
};

// === HELPER: Footer Nav ===
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
      className="group flex flex-row relative w-full h-48 md:h-64 overflow-hidden border-b border-black/10 dark:border-white/10 bg-white dark:bg-black transition-all duration-500 cursor-pointer active:scale-[0.98]"
    >
      <div className={`flex w-[12vw] md:w-[8vw] h-full items-center justify-center transition-colors shrink-0 z-20 
        ${isNext ? 'order-last border-l' : 'order-first border-r'} border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0a] group-hover:bg-[#5227ff]`}>
        <svg className={`w-6 h-6 md:w-8 md:h-8 text-black dark:text-white transition-transform duration-500 ${isNext ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isNext ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </div>

      <div className={`relative flex-1 h-full overflow-hidden flex flex-col justify-center px-6 md:px-16 z-10 ${isNext ? 'items-end text-right' : 'items-start text-left'}`}>
        <img 
          src={entry.heroImage} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 
            ${isMobile ? 'opacity-90 saturate-100 blur-[2px]' : 'opacity-80 saturate-[0.8] group-hover:opacity-100 group-hover:saturate-100 group-hover:scale-[1.02]'}`} 
          alt="" 
        />
        <div className={`absolute inset-0 transition-colors duration-500 ${isMobile ? 'bg-black/40' : 'bg-black/60 group-hover:bg-black/40'}`} />
        
        <div className="relative z-10 w-full flex flex-col items-inherit text-white">
          <div className={`flex items-center gap-2 font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-white/50 mb-2 transition-all duration-500
            ${isMobile ? 'opacity-100' : 'opacity-0 -translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'}
            ${isNext ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-[#5227ff] font-black tracking-widest">{isNext ? "NEXT" : "PREVIOUS"}</span>
            <span className="w-px h-2 bg-white/20" />
            <span>No. {String(num).padStart(3, '0')}</span>
          </div>
          <h2 className="font-editorial italic font-bold text-2xl md:text-4xl uppercase leading-none drop-shadow-lg">{entry.title}</h2>
        </div>
      </div>
    </div>
  );
};

// === MAIN SLIDE ===
const ReviewSlide = ({ review, isReading, setIsReading, active, transform, onNavClick, isExiting, isMobile, children }) => {
  const contentRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [starsVisible, setStarsVisible] = useState(false);

  // RESET SCROLL WHEN ENTRY CHANGES
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
    const timer = setTimeout(() => setStarsVisible(true), 150);
    return () => clearTimeout(timer);
  }, [review.id]);

  const handleMouseMove = (e) => {
    if (isReading || isExiting || isMobile) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 5; 
    const y = (clientY / height - 0.5) * 5;
    setMousePos({ x, y });
  };

  const handleContentScroll = (e) => {
    if (!contentRef.current) return;
    if (contentRef.current.scrollTop === 0 && e.deltaY < -20) setIsReading(false);
  };

  // NATIVE MOBILE SCROLL HANDLING
  // We removed the complex touch listeners to fix the "fluidity" issue.
  // Now we just use standard CSS overflow for native feel.

  if (!review) return null;
  const vaultItems = reviews.filter(r => r.type !== 'feature');
  const currentIndex = vaultItems.findIndex(r => r.id === review.id);
  const currentEntryNum = vaultItems.length - currentIndex;
  const nextItem = currentIndex > 0 ? vaultItems[currentIndex - 1] : null;
  const prevItem = currentIndex < vaultItems.length - 1 ? vaultItems[currentIndex + 1] : null;
  const isVisualReading = isExiting || isReading;

  // Mobile Layout Config
  const mobileHeroStyle = isMobile ? {
    height: isReading ? '35%' : '100%',
    transition: 'height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
  } : {};

  const mobileContentStyle = isMobile ? {
    top: isReading ? '35%' : '100%',
    height: isReading ? '65%' : '0%',
    transition: 'top 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
  } : {};

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`absolute inset-0 w-full h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-transform duration-700 will-change-transform ${transform}`} 
      style={{ transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)' }}
    >
       {/* HERO */}
       <div 
         onClick={() => !isReading && setIsReading(true)}
         style={isMobile ? mobileHeroStyle : undefined}
         className={`relative overflow-hidden shrink-0 z-10 shadow-2xl
         ${isMobile ? 'absolute top-0 w-full' : (isVisualReading ? 'w-[55vw] h-screen cursor-pointer' : 'w-full h-screen')}`}
       >
        <div className="absolute inset-0" 
             style={{ transform: (!isMobile && !isVisualReading) ? `scale(1.1) translate3d(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px, 0)` : 'scale(1.0)' }}>
          <img src={review.heroImage} className="w-full h-full object-cover transition-all duration-700" alt="" />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
        </div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-all duration-700
            ${isMobile && isReading ? 'opacity-0 translate-y-[-20%]' : 'opacity-100 translate-y-0'}`}
            style={{ transform: (!isMobile && !isVisualReading) ? `translate3d(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px, 0)` : undefined }}>
          
          <div className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-white/80 mb-4 drop-shadow-md">
            NO. {String(currentEntryNum).padStart(3, '0')} <span className="mx-2 text-[#5227ff]">//</span> {review.publishedDate}
          </div>
          <div className="text-4xl md:text-6xl mb-6 drop-shadow-xl text-white">
             <ReviewStars rating={review.ratingStars} isVisible={starsVisible} />
          </div>
          <h1 className="font-editorial italic font-bold text-5xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tight mb-8 max-w-4xl text-white drop-shadow-2xl">
            {review.title}
          </h1>
        </div>

        {!isReading && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce z-30 pointer-events-none text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </div>
        )}
      </div>

      {/* JOURNAL CONTENT */}
      <div 
        style={isMobile ? mobileContentStyle : undefined}
        className={`bg-gray-50 dark:bg-[#050505] flex flex-col z-20 transition-all duration-700
        ${isMobile ? 'absolute w-full border-t border-black/10 dark:border-white/10' : (isVisualReading ? 'absolute right-0 top-0 bottom-0 md:w-[45vw] translate-x-0' : 'absolute right-0 top-0 bottom-0 md:w-0 translate-x-full')}`}
      >
        {isMobile && <div onClick={() => setIsReading(false)} className="w-full py-3 flex justify-center cursor-pointer bg-white dark:bg-black border-b border-black/5 dark:border-white/5"><div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" /></div>}
        
        {!isMobile && (
          <button onClick={() => setIsReading(false)} className="absolute top-6 left-6 z-50 p-2 text-black/50 dark:text-white/50 hover:text-[#5227ff]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}

        <div ref={contentRef} onWheel={!isMobile ? handleContentScroll : undefined} className="flex-1 overflow-y-auto custom-scrollbar relative px-8 md:px-16 pt-8 pb-24">
            <div className="mb-12 border-b border-black/10 dark:border-white/10 pb-8">
              <span className="bg-[#5227ff] text-white px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded">The Verdict</span>
              <h2 className="font-editorial italic text-3xl md:text-4xl mt-4 text-black dark:text-white leading-tight">"{review.verdict}"</h2>
            </div>

            <div className="prose prose-lg dark:prose-invert font-light text-gray-800 dark:text-gray-300 leading-relaxed">
              {review.paragraphs?.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} className="mb-6" />
              ))}
            </div>

            {/* HYPERLINK / ITALIC TIP: 
                Just use <a href='url'>Link</a> or <i>Title</i> in your paragraph text. 
                The dangerouslySetInnerHTML above handles it automatically. */}

            <div className="mt-20 pt-10 border-t border-black/10 dark:border-white/10">
               {children}
            </div>
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const vaultItems = reviews.filter(r => r.type !== 'feature');
  const currentIndex = vaultItems.findIndex(r => r.id === activeId); 
  const currentItem = vaultItems[currentIndex];
  const nextEntry = currentIndex > 0 ? vaultItems[currentIndex - 1] : null;
  const prevEntry = currentIndex < vaultItems.length - 1 ? vaultItems[currentIndex + 1] : null;

  const handleNavClick = (targetId, type) => {
    setOutgoingId(activeId);
    setOutgoingAnimState('idle'); 
    setActiveId(targetId);
    setAnimState(SWIPE_MAP[type].enter);
    setIsReading(false); 
    window.history.pushState(null, '', `/daily/${targetId}`);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOutgoingAnimState(SWIPE_MAP[type].exit);
        setAnimState('idle');
      });
    });
    setTimeout(() => { setOutgoingId(null); }, 700); 
  };

  const getPageTransform = (state) => {
    switch (state) {
      case 'idle': return 'translate-x-0 opacity-100 scale-100';
      case 'exit-left': return '-translate-x-full opacity-50 scale-95';
      case 'exit-right': return 'translate-x-full opacity-50 scale-95';
      case 'enter-left': return '-translate-x-full opacity-0 scale-100';
      case 'enter-right': return 'translate-x-full opacity-0 scale-100';
      default: return 'translate-x-0';
    }
  };

  return (
    <div className="relative w-full h-screen bg-white dark:bg-black overflow-hidden">
      {outgoingId && (
        <ReviewSlide review={reviews.find(r => r.id === outgoingId)} isReading={false} isExiting={true} transform={getPageTransform(outgoingAnimState)} isMobile={isMobile} />
      )}
      <ReviewSlide review={currentItem} isReading={isReading} setIsReading={setIsReading} transform={getPageTransform(animState)} isMobile={isMobile}>
         <div className="flex flex-col gap-0 w-full">
            {nextEntry && <FooterNavCard entry={nextEntry} type="next" onNavClick={handleNavClick} allItems={vaultItems} isMobile={isMobile} />}
            {prevEntry && <FooterNavCard entry={prevEntry} type="prev" onNavClick={handleNavClick} allItems={vaultItems} isMobile={isMobile} />}
            <div className="py-12 text-center">
              <Link to="/vault" className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-[#5227ff]">[ Back to Daily Log ]</Link>
            </div>
         </div>
      </ReviewSlide>
    </div>
  );
};

export default VaultReview;