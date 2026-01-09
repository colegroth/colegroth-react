import React, { useState, useEffect, useRef } from 'react';
import { client } from '../sanityClient';
import MagicBento from '../blocks/MagicBento';
import VaultList from '../blocks/VaultList';
import Prism from '../blocks/Prism'; 
import SEO from '../components/SEO';

const CONFIG = {
  sundanceStart: new Date('2026-01-22T00:00:00'),
  manualCount: 0, 
  parallax: { featuresHeader: -0.02, vaultHeader: -0.01 },
  spacing: { vaultHeaderTop: "mt-0 md:mt-4", vaultListTop: "mt-6 md:mt-8" },
  subtitles: {
    vault: "My daily viewing log. Random rewatches, hidden gems, and hot takes."
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
  const [totalMovies, setTotalMovies] = useState(0);
  const [timeToSundance, setTimeToSundance] = useState("");
  const [loading, setLoading] = useState(true);

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

  // Sundance Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = CONFIG.sundanceStart - now;
      if (diff <= 0) {
        setTimeToSundance("LIVE");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        setTimeToSundance(`${days}D ${hours}H`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await client.fetch(
          `*[_type == "featureReview" || _type == "vaultReview"] | order(publishedAt desc, _createdAt desc) [0...100] {
            ...,
            slug { current },
            quotes
          }`
        );

        const now = new Date();

        // 1. Filter Future Posts
        const publishedItems = rawData.filter(item => {
          if (item.publishedAt) return new Date(item.publishedAt) < now;
          return true; 
        });

        // 2. Count 2026
        const thisYearItems = publishedItems.filter(item => {
          const date = new Date(item.publishedAt || item.publishedDate || item._createdAt);
          return date.getFullYear() === 2026;
        });
        setTotalMovies(thisYearItems.length + CONFIG.manualCount);

        // 3. Split Data
        const featuresRaw = publishedItems.filter(i => i._type === 'featureReview');
        const vaultRaw = publishedItems.filter(i => i._type === 'vaultReview');

        // 4. Sort Features (Featured First)
        featuresRaw.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          const dateA = new Date(a.publishedAt || a._createdAt);
          const dateB = new Date(b.publishedAt || b._createdAt);
          return dateB - dateA;
        });

        // 5. Sort Vault (Newest First)
        vaultRaw.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.publishedDate || a._createdAt);
          const dateB = new Date(b.publishedAt || b.publishedDate || b._createdAt);
          return dateB - dateA;
        });

        const optimize = (url) => url ? `${url}?auto=format&w=800&q=80` : null;

        const formattedFeatures = featuresRaw.slice(0, 3).map((item, index) => {
          const dateObj = new Date(item.publishedAt || item.publishedDate || item._createdAt);
          return {
            id: item.slug?.current || item._id,
            title: item.title,
            director: item.director,
            year: item.year,
            ratingStars: item.ratingStars,
            heroImage: optimize(item.heroImage),
            type: index === 0 ? 'FEATURED REVIEW' : 'LATEST REVIEW',
            quote: item.verdict, 
            verdict: item.verdict,
            // ADDED: Formatted Date for Bento
            displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
            className: "active:scale-[0.98] transition-transform duration-200"
          };
        });

        const formattedVault = vaultRaw.slice(0, 4).map(item => ({
          id: item.slug?.current || item._id,
          title: item.title,
          director: item.director,
          year: item.year,
          rating: item.ratingStars,
          poster: optimize(item.heroImage),
          className: "active:scale-[0.97] transition-transform duration-200", 
          watchedDate: item.publishedAt || item.publishedDate
            ? new Date(item.publishedAt || item.publishedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase() 
            : 'RECENTS'
        }));

        setFeatures(formattedFeatures);
        setVaultItems(formattedVault);
        setLoading(false);
      } catch (error) {
        console.error("Home fetch error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden text-white">
      <SEO title="Home" />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isMobile ? (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#1a1a2e_0%,_#000000_80%)] opacity-60" />
        ) : (
          <Prism />
        )}
      </div>

      <div className="relative z-10 pt-12 md:pt-20">
        
        {/* HERO */}
        <section className="flex flex-col items-center justify-center mb-8 text-center px-6">
           <h1 className="animate-enter font-editorial italic font-bold text-[13vw] md:text-[8rem] leading-[0.85] tracking-tighter text-white drop-shadow-2xl">
             GROTH <span className="text-[#5227ff]">ON</span> FILM
           </h1>
           <p className="animate-enter font-mono text-white/40 text-[9px] md:text-[10px] uppercase tracking-[0.4em] mt-2">
             Honest takes on theatrical & streaming releases
           </p>
        </section>

        {/* DASHBOARD BAR */}
        <section className="max-w-7xl mx-auto px-6 mb-10">
          <div className="w-full border-y border-white/10 bg-white/5 backdrop-blur-sm py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
               <div className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5227ff] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5227ff]"></span>
               </div>
               <span className="font-mono text-[10px] md:text-xs text-white/70 uppercase tracking-widest">
                 2026 Watchlist: <span className="text-white font-bold ml-1">{totalMovies}</span>
               </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center md:items-end leading-none">
                 <span className="font-mono text-[8px] text-[#5227ff] uppercase tracking-[0.2em] mb-1">Countdown to Sundance</span>
                 <span className="font-editorial italic text-white text-lg">{timeToSundance}</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden md:block" />
              <div className="group relative opacity-50 cursor-not-allowed">
                 <div className="flex items-center gap-2">
                   <span className="text-sm">🔒</span>
                   <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">Sundance Hub</span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED REVIEWS */}
        <section className="mb-8 md:mb-12 min-h-[400px]">
          {!loading && features.length > 0 ? (
            <MagicBento items={features} />
          ) : (
             <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="w-6 h-6 border-2 border-[#5227ff] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-mono text-xs text-white uppercase tracking-widest">Loading Reviews...</p>
             </div>
          )}
        </section>

        {/* VAULT SECTION */}
        <section ref={vaultSectionRef} className={`max-w-7xl mx-auto px-6 md:px-8 text-center ${CONFIG.spacing.vaultHeaderTop}`}>
          <div className="flex flex-col items-center">
            <span className="font-mono text-white/30 text-[9px] uppercase tracking-[0.5em] block mb-2">
              :: Daily Log ::
            </span>
            <h2 className="font-editorial italic font-bold text-[10vw] md:text-[6rem] whitespace-nowrap uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
              The Vault
            </h2>
            <div className="h-0.5 w-16 mx-auto mt-4 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
            <p className="mt-4 font-editorial text-white/50 italic leading-tight max-w-2xl mx-auto text-center text-sm md:text-lg">
              {CONFIG.subtitles.vault}
            </p>
          </div>
        </section>

        <section className={`pb-12 ${CONFIG.spacing.vaultListTop}`}>
          <VaultList items={vaultItems} />
        </section>
      </div>
    </div>
  );
}