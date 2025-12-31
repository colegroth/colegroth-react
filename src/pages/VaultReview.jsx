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
      className="group flex flex-row relative w-full h-48 md:h-64 overflow-hidden border-b border-white/10 bg-black transition-all duration-500 cursor-pointer active:scale-[0.98]"
    >
      <div className={`flex w-[12vw] md:w-[8vw] h-full items-center justify-center transition-colors shrink-0 z-20 
        ${isNext ? 'order-last border-l' : 'order-first border-r'} border-white/10 bg-[#0a0a0a] group-hover:bg-[#5227ff]`}>
        <svg className={`w-6 h-6 md:w-8 md:h-8 text-white transition-transform duration-500 ${isNext ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        <div className="relative z-10 w-full flex flex-col items-inherit">
          <div className={`flex items-center gap-2 font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-white/50 mb-2 transition-all duration-500
            ${isMobile ? 'opacity-100' : 'opacity-0 -translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'}
            ${isNext ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-[#5227ff] font-black tracking-widest">{isNext ? "NEXT" : "PREVIOUS"}</span>
            <span className="w-px h-2 bg-white/20" />
            <span>No. {String(num).padStart(3, '0')}</span>
          </div>

          <h2 className="font-editorial italic font-bold text-2xl md:text-4xl text-white uppercase leading-none drop-shadow-lg transition-transform duration-500 group-hover:scale-[1.01] origin-left">{entry.title}</h2>
          
          <div className={`flex items-center gap-3 mt-3 transition-all duration-500 delay-75
             ${isMobile ? 'opacity-100' : 'opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'} 
             ${isNext ? 'flex-row-reverse' : 'flex-row'}`}>
             <div className="text-sm md:text-xl">
               <ReviewStars rating={entry.ratingStars} isVisible={isHovered || isMobile} />
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
      className={`absolute ${isNext ? 'right-0 justify-end pr-8' : 'left-0 justify-start pl-8'} top-0 bottom-0 w-48 flex items-center pointer-events-auto cursor-pointer group z-50 transition-transform active:scale-95 hidden md:flex`}
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
  const mobileContainerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [starsVisible, setStarsVisible] = useState(false);
  const [textTilt, setTextTilt] = useState({ x: 0, y: 0 });
  
  // Mobile Scroll State
  const [scrollY, setScrollY] = useState(0);

  // Updated useEffect inside ReviewSlide
  useEffect(() => {
    // 1. Reset Desktop Scroll
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

    // 2. Reset Mobile Scroll & Parallax State
    if (mobileContainerRef.current) {
      mobileContainerRef.current.scrollTop = 0;
      setScrollY(0);
    }

    // 3. Reset Stars for animation replay
    setStarsVisible(false);
    const timer = setTimeout(() => setStarsVisible(true), 150);
    
    return () => clearTimeout(timer);
  }, [review.id]);

  // Handle Hero Image Parallax (Desktop)
  const handleMouseMove = (e) => {
    if (isReading || isExiting || isMobile) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 5; 
    const y = (clientY / height - 0.5) * 5;
    setMousePos({ x, y });
  };

  // Handle Text Tilt (Desktop)
  const handleTextTilt = (e) => {
    if (isMobile) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2; 
    const y = ((e.clientY - top) / height - 0.5) * 2; 
    setTextTilt({ x: x * 2, y: y * 2 });
  };

  const resetTextTilt = () => setTextTilt({ x: 0, y: 0 });

  const handleContentScroll = (e) => {
    if (!contentRef.current) return;
    if (contentRef.current.scrollTop === 0 && e.deltaY < -20) {
      setIsReading(false);
    }
  };

  // Mobile Continuous Scroll Handler
  const handleMobileScroll = (e) => {
    setScrollY(e.target.scrollTop);
  };

  if (!review) return null;
  const vaultItems = reviews.filter(r => r.type !== 'feature');
  const currentIndex = vaultItems.findIndex(r => r.id === review.id);
  const currentEntryNum = vaultItems.length - currentIndex;
  const nextItem = currentIndex > 0 ? vaultItems[currentIndex - 1] : null;
  const prevItem = currentIndex < vaultItems.length - 1 ? vaultItems[currentIndex + 1] : null;
  const isVisualReading = isExiting || isReading;

  // === MOBILE RENDER LOGIC ===
  if (isMobile) {
    const vh = window.innerHeight;
    const maxScroll = vh * 0.7; 
    
    // Clamp Hero Height: Min 30vh, Max 100vh
    const rawHeight = vh - scrollY;
    const minHeight = vh * 0.3;
    const heroHeight = Math.max(minHeight, rawHeight);

    // Text Animation: Scale down
    const progress = Math.min(scrollY / maxScroll, 1);
    const textScale = 1 - (progress * 0.45); 
    
    return (
      <div className="relative w-full h-full bg-black">
        
        {/* 1. FIXED HERO SECTION (High Z-Index)
            It sits ON TOP of the scroll container (z-50).
            Crucially, pointer-events-none allows you to scroll "through" it.
        */}
        <div 
          className="fixed top-0 left-0 w-full z-50 overflow-hidden shadow-2xl will-change-[height] pointer-events-none"
          style={{ height: heroHeight + 'px' }}
        >
          <img 
            src={review.heroImage} 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scale(' + (1 + progress * 0.1) + ')' }}
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />
          
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 will-change-transform"
            style={{ transform: 'scale(' + textScale + ')' }}
          >
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/70 mb-2">NO. {String(currentEntryNum).padStart(3, '0')}</div>
            <h1 className="font-editorial italic font-bold text-5xl uppercase leading-[0.85] drop-shadow-lg mb-4">{review.title}</h1>
            <ReviewStars rating={review.ratingStars} isVisible={true} />
            
            <div 
                className="mt-8 absolute -bottom-12 transition-opacity duration-300"
                style={{ opacity: 1 - (progress * 3) }} 
            >
                <svg className="w-6 h-6 text-white/50 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
          </div>
        </div>

        {/* 2. MAIN SCROLL CONTAINER (Lower Z-Index)
            It sits BEHIND the header (z-10).
            The content slides UP underneath the fixed header.
        */}
        <div 
          ref={mobileContainerRef}
          onScroll={handleMobileScroll}
          className="absolute inset-0 z-10 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          {/* Spacer starts content below the fold (100vh) */}
          <div style={{ height: '100vh', width: '100%' }} className="pointer-events-none" />

          <div className="bg-[#050505] relative w-full min-h-screen shadow-[0_-20px_60px_rgba(0,0,0,1)] border-t border-white/10 rounded-t-3xl -mt-4">
             <div className="w-full flex justify-center py-4">
               <div className="w-12 h-1 bg-white/20 rounded-full" />
             </div>

             <div className="px-6 pb-20">
                <span className="bg-[#5227ff] px-3 py-1 rounded text-white font-bold font-mono text-[10px] uppercase tracking-widest w-fit shadow-[0_0_20px_rgba(82,39,255,0.4)]">The Verdict</span>
                <h2 className="font-editorial italic font-bold text-3xl leading-tight text-white/90 mt-5">"{review.verdict}"</h2>
                
                <div className="prose prose-invert mt-8 text-gray-300 font-light leading-relaxed">
                  {review.paragraphs?.map((p, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: p }} className="mb-6" />
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                   {children}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // === DESKTOP RENDER LOGIC ===
  const desktopImageClasses = isVisualReading 
    ? 'w-[55vw] h-screen group cursor-pointer active:scale-[0.99]' 
    : 'w-[100vw] h-[100vh]';

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`absolute inset-0 w-full h-screen overflow-hidden bg-black text-white transition-transform duration-700 will-change-transform ${transform}`} 
      style={{ transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)' }}
    >
       <div 
         onClick={() => (isReading && setIsReading(false))} 
         onWheel={(e) => !isReading && e.deltaY > 20 && setIsReading(true)}
         className={`relative transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden shrink-0 z-10 shadow-[0_10px_60px_rgba(0,0,0,1)] ${desktopImageClasses}`}
       >
        <div className="absolute inset-0 transition-transform duration-100 ease-out will-change-transform" 
             style={{ transform: `scale(1.1) translate3d(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px, 0)` }}>
          <img src={review.heroImage} className={`w-full h-full object-cover transition-all duration-700 object-[center_20%] ${isVisualReading ? '' : 'opacity-70'}`} alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
        </div>

        {isVisualReading && (
          <div className="absolute top-0 right-0 bottom-0 w-24 flex items-center justify-end pr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
             <div className="flex items-center gap-3 [writing-mode:vertical-rl] rotate-180">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">Close Entry</span>
                <div className="w-px h-8 bg-white/40" />
             </div>
          </div>
        )}

        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 animate-snap-out transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]
            ${isVisualReading ? 'opacity-100' : ''}`}
          style={{ transform: !isVisualReading ? `translate3d(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px, 0) rotateY(${mousePos.x * 0.5}deg)` : undefined }}
        >
          <div className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-white/70 mb-4 drop-shadow-xl">
            NO. {String(currentEntryNum).padStart(3, '0')} <span className="mx-2 text-[#5227ff]">//</span> {review.publishedDate}
          </div>
          <div className={`text-4xl md:text-6xl mb-6 drop-shadow-2xl transition-all duration-300`}>
             <ReviewStars rating={review.ratingStars} isVisible={starsVisible} />
          </div>
          <h1 className="font-editorial italic font-bold text-5xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tight mb-8 max-w-4xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {review.title}
          </h1>
          <div className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] text-white/60 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            Dir. {review.director} <span className="mx-2 text-white/20">|</span> {review.year}
          </div>
        </div>

        {!isVisualReading && active && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            {prevItem && <QuickNavArrow item={prevItem} type="prev" onNavClick={onNavClick} />}
            {nextItem && <QuickNavArrow item={nextItem} type="next" onNavClick={onNavClick} />}
          </div>
        )}

        <div className={`absolute bottom-12 left-0 right-0 flex justify-center transition-all duration-700 
          ${isVisualReading ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'} z-30`}>
          <button onClick={() => setIsReading(true)} className="group flex flex-col items-center gap-3 transition-transform duration-200 active:scale-90">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">Read Entry</span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#5227ff] transition-all">
              <svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
          </button>
        </div>
      </div>

      <div className={`bg-[#050505] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] z-20 
        ${isVisualReading ? 'absolute right-0 top-0 bottom-0 md:w-[45vw] opacity-100' : 'absolute right-0 top-0 bottom-0 md:w-0 opacity-0 translate-x-12'}`}>
        
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

        <button onClick={() => setIsReading(false)} className="absolute top-6 left-6 z-[100] p-3 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div ref={contentRef} onWheel={active ? handleContentScroll : undefined} className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="px-8 md:px-16 pt-8 md:pt-32 pb-8 border-b border-white/10">
            <style>{`
               @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
               .animate-verdict { animation: slideUpFade 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
            `}</style>
            <span className="bg-[#5227ff] px-3 py-1 rounded text-white font-bold font-mono text-[10px] uppercase tracking-widest w-fit shadow-[0_0_20px_rgba(82,39,255,0.4)]">The Verdict</span>
            <h2 className="animate-verdict font-editorial italic font-bold text-3xl md:text-5xl leading-tight text-white/90 mt-5 opacity-0" style={{ animationDelay: '0.1s' }}>"{review.verdict}"</h2>
            <div className="flex items-center gap-3 font-editorial italic font-black text-xs md:text-sm text-white/50 tracking-widest uppercase mt-8 animate-verdict opacity-0" style={{ animationDelay: '0.2s' }}>
                <div className="h-2 w-2 rounded-full bg-[#5227ff] shadow-[0_0_10px_#5227ff]" />
                Review by Cole Groth
            </div>
          </div>
          
          <div 
             onMouseMove={handleTextTilt}
             onMouseLeave={resetTextTilt}
             className="px-8 md:px-16 py-12"
             style={{ 
               transform: `perspective(1000px) rotateX(${-textTilt.y}deg) rotateY(${textTilt.x}deg)`,
               transition: 'transform 0.1s ease-out'
             }}
          >
            <div className={`prose prose-lg dark:prose-invert font-light text-gray-800 dark:text-gray-300 leading-relaxed [&_a]:text-[#5227ff] [&_a]:no-underline hover:[&_a]:underline [&_b]:text-black dark:[&_b]:text-white [&_b]:font-bold [&_i]:text-black dark:[&_i]:text-white`}>
              {review.paragraphs?.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} className="mb-6 drop-shadow-lg" />
              ))}
            </div>

            <p className="mt-8 text-white/80 font-normal">
              <span className="italic font-bold">{review.title}</span> {review.footerText ? review.footerText.replace(review.title, '') : "is available now."}
              {review.footerLink && (
                 <a href={review.footerLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#5227ff] hover:text-white underline decoration-[#5227ff] underline-offset-4 transition-colors">
                   Watch here.
                 </a>
              )}
            </p>
          </div>
          {children} 
        </div>
      </div>
    </div>
  );
};

// === MAIN VAULT COMPONENT ===
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

    setTimeout(() => { setIsAnimating(false); setOutgoingId(null); }, 700); 
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
        .animate-snap-out { animation: snapOut 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; perspective: 1000px; }
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