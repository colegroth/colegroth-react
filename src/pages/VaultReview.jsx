import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { reviews } from '../data/reviews'; 
import LightPillar from '../blocks/LightPillar'; 

const VaultReview = () => {
  const { id } = useParams(); 
  const [review, setReview] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showBackBtn, setShowBackBtn] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const SETTINGS = {
    hero: {
      directorTop: 'top-[20%]', 
      titleOffset: 'mt-0', 
      starsOffset: 'mt-8', 
      bottomMetaTop: 'top-[80%]',
    },
    background: {
      topColor: '#5227FF',
      bottomColor: '#000000',
      intensity: 0.25,
      rotationSpeed: 0.1,
      pillarWidth: 3.5
    },
    spectrum: {
      10: '#00ff41', 9: '#88ff00', 8: '#ccff00', 7: '#eeff00', 
      6: '#ffff00', 5: '#ffcc00', 4: '#ff9500', 3: '#ff5e00', 
      2: '#ff0000', 1: '#8b0000', 0: '#ffffff'
    },
    heroImageOpacity: 0.6,
    // TRANSITION CONTROL: Lowering this makes the fade-out more aggressive
    heroGradientStrength: '80%', 
    textGlowIntensity: '30px',
    glowOpacity: '55', 
    parallax: {
      title: -0.35,   
      metaTop: -0.15, 
      metaBottom: -0.2,
    },
    footer: {
      height: 'h-[50vh]',
      bgOpacityDefault: 0.8,
      bgOpacityHover: 1,
      transitionSpeed: 'duration-700',
    },
    titleFont: "font-editorial italic font-bold",
    metaFont: "font-mono",
    bodyFont: "font-sans",
  };

  const vaultItems = reviews.filter(r => r.type !== 'feature');
  const currentIndex = vaultItems.findIndex(r => r.id === id); 
  const currentEntryNum = vaultItems.length - currentIndex;
  
  const nextEntry = currentIndex > 0 ? vaultItems[currentIndex - 1] : null;
  const nextEntryNum = nextEntry ? vaultItems.length - (currentIndex - 1) : null;
  const prevEntry = currentIndex < vaultItems.length - 1 ? vaultItems[currentIndex + 1] : null;
  const prevEntryNum = prevEntry ? vaultItems.length - (currentIndex + 1) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = reviews.find(r => r.id === id); 
    if (found) {
      setReview(found);
      setLoaded(false);
      setTimeout(() => setLoaded(true), 200); 
    }
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowBackBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (!review) return <div className="h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest">Accessing Vault...</div>;

  const getRatingData = (stars) => {
    const fullStars = (stars.match(/★/g) || []).length;
    const halfStar = stars.includes('½') ? 0.5 : 0;
    const score = Math.round((fullStars + halfStar) * 2);
    const validScore = Math.max(0, Math.min(10, score));
    return { color: SETTINGS.spectrum[validScore] || '#ffffff', starArray: stars.split('') };
  };

  const { color, starArray } = getRatingData(review.ratingStars);

  return (
    <div className={`bg-[#050505] min-h-screen text-white ${SETTINGS.bodyFont} selection:bg-white selection:text-black relative`}>
      
      {/* 1. UNDERLYING BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LightPillar 
          topColor={SETTINGS.background.topColor} 
          bottomColor={SETTINGS.background.bottomColor} 
          intensity={SETTINGS.background.intensity} 
          rotationSpeed={SETTINGS.background.rotationSpeed}
          pillarWidth={SETTINGS.background.pillarWidth}
        />
      </div>

      <Link 
        to="/vault"
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-full transition-all duration-500 hover:border-white/40 hover:bg-black group ${showBackBtn ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <span className={`${SETTINGS.metaFont} text-xs uppercase tracking-widest text-white/70 group-hover:text-white`}>Return to Vault</span>
        <div className="w-2 h-2 bg-[#5227ff] rounded-full group-hover:shadow-[0_0_10px_#5227ff] transition-all" />
      </Link>

      {/* 2. HERO IMAGE LAYER - Now strictly above the Pillar (z-10) */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center z-10">
        <div className="absolute inset-0">
          <img 
            src={review.heroImage} 
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{ 
              opacity: loaded ? SETTINGS.heroImageOpacity : 0,
              transform: `scale(1.05) translateY(${scrollY * 0.1}px)`,
              // This mask reveals the pillar underneath by becoming transparent at the bottom
              maskImage: `linear-gradient(to bottom, black 0%, black ${SETTINGS.heroGradientStrength}, transparent 100%)`, 
              WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${SETTINGS.heroGradientStrength}, transparent 100%)` 
            }}
            alt=""
          />
        </div>

        {/* HERO TEXT CONTENT - Nested in z-10 for visibility */}
        <div className={`absolute ${SETTINGS.hero.directorTop} left-0 right-0 z-20`} style={{ transform: `translateY(${scrollY * SETTINGS.parallax.metaTop}px)` }}>
           <span className={`${SETTINGS.metaFont} inline-block text-xs md:text-sm uppercase tracking-[0.4em] text-white/50 bg-black/30 px-8 py-3 rounded-full backdrop-blur-sm border border-white/5 transition-all duration-1000 ease-out`}
                 style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(-15px)' }}>
             Dir. {review.director} &nbsp;//&nbsp; {review.year}
           </span>
        </div>

        <div className={`relative z-20 px-6 max-w-5xl mx-auto ${SETTINGS.hero.titleOffset}`} style={{ transform: `translateY(${scrollY * SETTINGS.parallax.title}px)` }}>
          <h1 className={`${SETTINGS.titleFont} text-7xl md:text-9xl lg:text-[10rem] uppercase tracking-tighter mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,1)] transition-all duration-1000 ease-out`} 
            style={{ 
              color: loaded ? color : 'transparent', 
              opacity: loaded ? 1 : 0, 
              transform: loaded ? 'translateY(0)' : 'translateY(40px)',
              textShadow: loaded ? `0 0 ${SETTINGS.textGlowIntensity} ${color}${SETTINGS.glowOpacity}` : 'none' 
            }}
          >
            {review.title}
          </h1>
          
          <div className={`flex justify-center gap-1 text-4xl md:text-5xl font-serif font-bold ${SETTINGS.hero.starsOffset}`}>
            {starArray.map((star, i) => (
              <span key={i} className="transition-all duration-500" style={{ color: color, textShadow: `0 0 20px ${color}66`, opacity: loaded ? 1 : 0, transform: loaded ? 'scale(1)' : 'scale(0.5)', transitionDelay: `${500 + (i * 80)}ms` }}>{star}</span>
            ))}
          </div>
        </div>

        <div className={`absolute ${SETTINGS.hero.bottomMetaTop} left-0 right-0 flex flex-col items-center z-20`} style={{ transform: `translateY(${scrollY * SETTINGS.parallax.metaBottom}px)` }}>
           <div className="flex items-center gap-4 transition-all duration-1000 ease-out" 
                style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '700ms' }}>
             <span className={`${SETTINGS.metaFont} text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70`}>NO. {String(currentEntryNum).padStart(3, '0')}</span>
             <span className="w-1 h-1 bg-white/30 rounded-full" />
             <span className={`${SETTINGS.metaFont} text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70`}>Watched: {review.publishedDate}</span>
           </div>
        </div>
      </div>

      {/* 3. BODY TEXT LAYER - Highest z-index to scroll over image and pillar */}
      <div className="relative z-30 max-w-3xl mx-auto px-6 pb-32 pt-12">
        <div className="space-y-8 text-lg md:text-xl leading-relaxed text-gray-300 font-light min-h-[30vh] text-left">
          {review.paragraphs.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
      </div>

      <div className={`relative z-30 grid grid-cols-1 md:grid-cols-2 ${SETTINGS.footer.height} border-t border-white/10`}>
        {/* Navigation buttons preserved... */}
        {prevEntry ? (
          <Link to={`/daily/${prevEntry.id}`} className="group relative w-full h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/10 block">
            <img src={prevEntry.heroImage} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-40 group-hover:opacity-100 group-hover:scale-110 saturate-0 group-hover:saturate-100" alt="" />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent transition-colors duration-700" />
            <div className="absolute inset-0 flex flex-col justify-center px-12 text-left">
              <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                <span className={`${SETTINGS.metaFont} text-[10px] uppercase tracking-widest text-white`}>NO. {String(prevEntryNum).padStart(3, '0')}</span>
                <span className="w-px h-3 bg-white/20" />
                <span className={`${SETTINGS.metaFont} text-[10px] uppercase tracking-widest text-white`}>{prevEntry.publishedDate}</span>
              </div>
              <span className="font-editorial italic font-bold text-xs uppercase tracking-widest text-[#5227ff] mb-1 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500">Previous Entry</span>
              <h2 className={`${SETTINGS.titleFont} text-5xl md:text-6xl text-white uppercase leading-none opacity-60 group-hover:opacity-100 transition-all duration-500`}>{prevEntry.title}</h2>
              <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                <span className={`${SETTINGS.metaFont} text-[10px] uppercase tracking-widest text-white/70`}>Dir. {prevEntry.director}</span>
                <span className="text-[#FFD700] font-serif font-bold text-lg drop-shadow-md">{prevEntry.ratingStars}</span>
              </div>
            </div>
          </Link>
        ) : <div className="h-full bg-[#080808] flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 font-mono text-xs text-white/20 uppercase tracking-widest">End of Archive</div>}

        {nextEntry ? (
          <Link to={`/daily/${nextEntry.id}`} className="group relative w-full h-full overflow-hidden block">
            <img src={nextEntry.heroImage} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-40 group-hover:opacity-100 group-hover:scale-110 saturate-0 group-hover:saturate-100" alt="" />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent transition-colors duration-700" />
            <div className="absolute inset-0 flex flex-col justify-center items-end px-12 text-right">
              <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                <span className={`${SETTINGS.metaFont} text-[10px] uppercase tracking-widest text-white`}>{nextEntry.publishedDate}</span>
                <span className="w-px h-3 bg-white/20" />
                <span className={`${SETTINGS.metaFont} text-[10px] uppercase tracking-widest text-white`}>NO. {String(nextEntryNum).padStart(3, '0')}</span>
              </div>
              <span className="font-editorial italic font-bold text-xs uppercase tracking-widest text-[#5227ff] mb-1 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">Next Entry</span>
              <h2 className={`${SETTINGS.titleFont} text-5xl md:text-6xl text-white uppercase leading-none opacity-60 group-hover:opacity-100 transition-all duration-500`}>{nextEntry.title}</h2>
              <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                <span className="text-[#FFD700] font-serif font-bold text-lg drop-shadow-md">{nextEntry.ratingStars}</span>
                <span className={`${SETTINGS.metaFont} text-[10px] uppercase tracking-widest text-white/70`}>Dir. {nextEntry.director}</span>
              </div>
            </div>
          </Link>
        ) : <div className="h-full bg-[#080808] flex items-center justify-center font-mono text-xs text-white/20 uppercase tracking-widest">Current Entry</div>}
      </div>
    </div>
  );
};

export default VaultReview;