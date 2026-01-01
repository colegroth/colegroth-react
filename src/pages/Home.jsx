import React, { useState, useEffect, useRef } from 'react';
import { client } from '../sanityClient';
import MagicBento from '../blocks/MagicBento';
import VaultList from '../blocks/VaultList';
import Prism from '../blocks/Prism'; 

const CONFIG = {
  parallax: {
    featuresHeader: -0.02, 
    vaultHeader: -0.01,    
  },
  motion: {
    direction: 'down',    
    distance: '40px',     
    duration: '1.2s',     
    delay: '0.2s'         
  },
  spacing: {
    vaultHeaderTop: "mt-0 md:mt-0", 
    vaultListTop: "mt-6 md:mt-10",
    labelMargin: "mb-2",
    titleMargin: "mt-1",
    subtitleMargin: "mt-3"
  },
  subtitles: {
    reviews: "Professional film criticism from a younger perspective. Honest takes on the latest theatrical and streaming releases",
    vault: "Check out my daily reviews here! Random rewatches, hidden gems, and controversial takes on older movies."
  }
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const vaultSectionRef = useRef(null);
  const [vaultOffset, setVaultOffset] = useState(0);

  // Data State
  const [features, setFeatures] = useState([]);
  const [vaultItems, setVaultItems] = useState([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleVaultScroll = () => {
      if (!vaultSectionRef.current) return;
      const top = vaultSectionRef.current.offsetTop;
      const height = window.innerHeight;
      const currentScroll = window.scrollY;
      if (currentScroll > top - height) {
        setVaultOffset((currentScroll - (top - height)) * CONFIG.parallax.vaultHeader);
      }
    };
    window.addEventListener('scroll', handleVaultScroll);
    return () => window.removeEventListener('scroll', handleVaultScroll);
  }, []);

  // FETCH SANITY DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Features: Featured item FIRST, then newest dates
        const featureData = await client.fetch(
          `*[_type == "featureReview"] | order(isFeatured desc, publishedDate desc)[0...3]`
        );

        // Fetch Vault: Newest dates only
        const vaultData = await client.fetch(
          `*[_type == "vaultReview"] | order(publishedDate desc)[0...4]`
        );

        // Format Features for MagicBento
        const formattedFeatures = featureData.map((item, index) => ({
          id: item.id,
          title: item.title,
          director: item.director,
          year: item.year,
          ratingStars: item.ratingStars,
          heroImage: item.heroImage,
          
          // Custom Pill Labels
          type: index === 0 ? 'FEATURED REVIEW' : 'REVIEW',
          
          // CHANGE: Pass the verdict instead of the quote
          verdict: item.verdict, 

          className: "active:scale-[0.98] transition-transform duration-200"
        }));

        // Format Vault for VaultList
        const formattedVault = vaultData.map(item => ({
          id: item._id, 
          title: item.title,
          director: item.director,
          year: item.year,
          rating: item.ratingStars,
          poster: item.heroImage,
          className: "active:scale-[0.97] transition-transform duration-200", 
          watchedDate: item.publishedDate 
            ? new Date(item.publishedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase() 
            : 'JAN 01'
        }));

        setFeatures(formattedFeatures);
        setVaultItems(formattedVault);
      } catch (error) {
        console.error("Home fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const Subtitle = ({ text }) => (
    <p className={`${CONFIG.spacing.subtitleMargin} font-editorial text-white/50 italic leading-tight max-w-2xl mx-auto text-center`}
       style={{ fontSize: 'clamp(11px, 2.2vw, 1.2rem)', textWrap: 'balance', width: '100%', display: 'block' }}>
      {text}
    </p>
  );

  const heroOpacity = Math.max(0, 1 - scrollY / 300);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isMobile ? (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#1a1a2e_0%,_#000000_80%)] opacity-60" />
        ) : (
          <Prism />
        )}
      </div>

      <div className="relative z-10 pt-8 md:pt-12">
        <section 
          className="flex flex-col items-center justify-center min-h-[25vh] mb-2 md:mb-6 text-center px-6 transition-opacity duration-300 ease-out"
          style={{ opacity: heroOpacity, pointerEvents: heroOpacity === 0 ? 'none' : 'auto' }}
        >
           <h1 className="animate-enter font-editorial italic font-bold text-[15vw] md:text-[10rem] leading-[0.8] tracking-tighter text-white mix-blend-difference drop-shadow-2xl">
             GROTH <br/> ON FILM
           </h1>
           <p className="animate-enter font-mono text-white/40 text-[9px] md:text-xs uppercase tracking-[0.8em] mt-4" 
              style={{ animationDelay: CONFIG.motion.delay }}>
             EST. 2026
           </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-8 mb-6 md:mb-10 text-center">
          <div className="flex flex-col items-center">
            <span className={`${CONFIG.spacing.labelMargin} font-mono text-white/30 text-[9px] uppercase tracking-[0.5em] block`}>
              :: Latest Coverage ::
            </span>
            <h2 className={`${CONFIG.spacing.titleMargin} font-editorial italic font-bold text-[8.5vw] md:text-[7rem] whitespace-nowrap uppercase tracking-tighter text-white leading-none w-full drop-shadow-[0_10px_30px_rgba(0,0,0,1)]`}
                style={{ transform: `translateY(${scrollY * CONFIG.parallax.featuresHeader}px)` }}>
              FEATURE REVIEWS
            </h2>
            <div className="h-0.5 w-16 mx-auto mt-2 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
            <Subtitle text={CONFIG.subtitles.reviews} />
          </div>
        </section>

        <section className="mb-8 md:mb-12">
          {features.length > 0 && <MagicBento items={features} />}
        </section>

        <section ref={vaultSectionRef} className={`max-w-7xl mx-auto px-6 md:px-8 text-center ${CONFIG.spacing.vaultHeaderTop}`}>
          <div className="flex flex-col items-center">
            <span className={`${CONFIG.spacing.labelMargin} font-mono text-white/30 text-[9px] uppercase tracking-[0.5em] block`}>
              :: Daily Log ::
            </span>
            <h2 className={`${CONFIG.spacing.titleMargin} font-editorial italic font-bold text-[10vw] md:text-[8rem] whitespace-nowrap uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,1)]`}
                style={{ transform: `translateY(${vaultOffset}px)` }}>
              The Vault
            </h2>
            <div className="h-0.5 w-20 mx-auto mt-2 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
            <Subtitle text={CONFIG.subtitles.vault} />
          </div>
        </section>

        <section className={`pb-4 ${CONFIG.spacing.vaultListTop}`}>
          <VaultList items={vaultItems} />
        </section>
      </div>
    </div>
  );
}