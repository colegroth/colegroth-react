import React, { useEffect, useState } from 'react';
import ProfileCard from '../blocks/ProfileCard';
import Aurora from '../blocks/Aurora';

const About = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center pb-24 selection:bg-[#5227ff] selection:text-white">
      
      {/* GLOBAL ANIMATION STYLES */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 1s cubic-bezier(0.2, 1, 0.3, 1) forwards;
          opacity: 0; 
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      {/* 1. BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
         <Aurora colorStops={["#5227ff", "#ff9ffc", "#5227ff"]} speed={0.2} />
      </div>

      {/* 2. HEADER SECTION */}
      <div className={`relative z-10 pt-32 md:pt-48 pb-12 md:pb-16 px-6 text-center w-full transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <span className="font-mono text-[10px] text-[#5227ff] uppercase tracking-[0.4em] mb-8 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(82,39,255,0.2)]">
            :: Identification ::
          </span>
          
          <h1 className="font-editorial italic font-bold text-7xl md:text-9xl lg:text-[11rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,1)] mix-blend-screen">
            About Me
          </h1>
          
          <div className="h-1 w-24 md:w-32 mx-auto mt-8 md:mt-12 bg-[#5227ff] shadow-[0_0_30px_#5227ff]" />
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* RIGHT COLUMN: PROFILE CARD */}
        <div className={`flex justify-center md:justify-end order-1 md:order-2 md:sticky md:top-32 animate-fade-up delay-100`}>
          <div className="w-full max-w-[320px] md:max-w-sm lg:max-w-md relative group">
             <div className="animate-[float_6s_ease-in-out_infinite]">
                <ProfileCard 
                  avatarUrl="/me.png" 
                  miniAvatarUrl="/me_2.jpg"
                  behindGlowColor="rgba(82, 39, 255, 0.2)"
                  behindGlowSize="40%"
                />
             </div>
          </div>
        </div>

        {/* LEFT COLUMN: TEXT & CONNECT */}
        <div className="space-y-16 order-2 md:order-1 animate-fade-up delay-200">
          
          {/* BIO SECTION */}
          <div className="relative pl-6 md:pl-8 border-l-2 border-[#5227ff]/50">
            <h2 className="font-editorial text-5xl md:text-7xl italic font-bold mb-8 tracking-tighter leading-[0.9] text-white drop-shadow-lg">
              Groth on Film.
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light text-zinc-300 leading-relaxed max-w-lg">
              <p>
                I’m <span className="text-white font-normal underline decoration-[#5227ff] underline-offset-4 decoration-2">Cole Groth</span>. 
                I watch a movie every single day. It’s a non-negotiable part of my life, a habit I’ve kept since 2020.
              </p>
              <p>
                This site serves as a vault for those experiences! Outside of my work with FandomWire, I write here.
                It is a curated collection of thoughts on the films that matter to me.
              </p>
              {/* FIXED: Removed text-zinc/opacity classes for full brightness */}
              <p className="text-white">
                I study Media Production at the University of Florida, but my real education happens on the big screen.
              </p>
            </div>
          </div>

          {/* CONNECT SECTION - COMPACT CARDS */}
          <div className="pt-8 border-t border-white/10">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#5227ff] mb-8 font-bold flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#5227ff] shadow-[0_0_10px_#5227ff]" />
              Connect
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  label: 'Twitter', 
                  handle: '@cole_groth', 
                  url: 'https://twitter.com/cole_groth',
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      {/* Twitter Bird */}
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )
                },
                { 
                  label: 'Instagram', 
                  handle: '@groth_cole', 
                  url: 'https://instagram.com/groth_cole',
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                       <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  )
                },
                { 
                  label: 'YouTube', 
                  handle: 'Groth Reviews', 
                  url: 'https://youtube.com/@GrothMovieReviews',
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                       <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  )
                },
                { 
                  label: 'Letterboxd', 
                  handle: 'Cole Groth', 
                  url: 'https://letterboxd.com/colegroth',
                  icon: (
                    /* Letterboxd Icon */
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5.67 1.5 1.5S7.83 14 7 14s-1.5-.67-1.5-1.5S6.17 11 7 11zm5 0c.83 0 1.5.67 1.5 1.5S12.83 14 12 14s-1.5-.67-1.5-1.5S11.17 11 12 11zm5 0c.83 0 1.5.67 1.5 1.5S17.83 14 17 14s-1.5-.67-1.5-1.5S16.17 11 17 11z" />
                    </svg>
                  )
                },
              ].map((link, i) => (
                <a 
                  key={i}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col justify-center p-4 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#5227ff]/40 transition-all duration-300 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 mb-2 text-white/50 group-hover:text-[#5227ff] transition-colors">
                     {link.icon}
                     <span className="font-mono text-[9px] uppercase tracking-widest">{link.label}</span>
                  </div>
                  <span className="font-editorial italic text-lg text-white group-hover:text-white transition-colors">
                    {link.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;