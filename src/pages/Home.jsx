import React, { useMemo } from 'react';
import MagicBento from '../blocks/MagicBento';
import VaultList from '../blocks/VaultList';
import Prism from '../blocks/Prism'; 
import { reviews } from '../data/reviews'; 

export default function Home() {
  const features = useMemo(() => {
    return reviews
      .filter(item => item.type === 'feature')
      .slice(0, 3); 
  }, []);

  const vaultItems = useMemo(() => {
    return reviews
      .filter(item => item.type === 'vault')
      .slice(0, 4) 
      .map(item => ({
        id: item.id,
        title: item.title,
        director: item.director,
        year: item.year,
        rating: item.ratingStars,
        poster: item.heroImage,
        watchedDate: item.publishedDate 
          ? new Date(item.publishedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase() 
          : 'JAN 01'
      }));
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Prism />
      </div>

      <div className="relative z-10 pt-48">
        
        {/* SECTION 1: FEATURES */}
        <section className="max-w-7xl mx-auto px-8 mb-24 text-center">
          <div className="flex flex-col items-center">
            <span className="font-mono text-white/40 text-[10px] uppercase tracking-[0.4em] mb-6 block">
              :: Featured Reviews ::
            </span>
            <h2 className="font-editorial italic font-bold text-7xl md:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
              GROTH ON FILM
            </h2>
            <div className="h-1 w-24 mx-auto mt-10 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
          </div>
        </section>

        <section className="mb-32">
          {features.length > 0 && <MagicBento items={features} />}
        </section>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto px-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-32" />
        </div>

        {/* SECTION 2: THE VAULT */}
        <section className="max-w-7xl mx-auto px-8 mb-24 text-center">
          <div className="flex flex-col items-center">
            <span className="font-mono text-white/40 text-[10px] uppercase tracking-[0.4em] mb-6 block">
              :: Daily Log ::
            </span>
            <h2 className="font-editorial italic font-bold text-7xl md:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
              The Vault
            </h2>
            <div className="h-1 w-40 mx-auto mt-10 bg-[#5227ff] shadow-[0_0_20px_rgba(82,39,255,1)]" />
          </div>
        </section>

        <section className="pb-32">
          <VaultList items={vaultItems} />
        </section>
      </div>
    </div>
  );
}