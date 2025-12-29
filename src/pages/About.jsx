import React from 'react';
import ProfileCard from '../blocks/ProfileCard';
import Aurora from '../blocks/Aurora';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center pb-24">
      
      {/* 1. BACKGROUND ANIMATION */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <Aurora colorStops={["#5227ff", "#ff9ffc", "#5227ff"]} speed={0.1} />
      </div>

      {/* 2. UNIFIED HEADER SECTION */}
      <div className="relative z-10 pt-32 md:pt-48 pb-12 md:pb-16 px-6 text-center w-full">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Metadata Pill */}
          <span className="font-mono text-[10px] text-[#5227ff] uppercase tracking-[0.4em] mb-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-[0_0_20px_rgba(82,39,255,0.15)]">
            :: Identification ::
          </span>
          
          {/* Mega Title - Responsive Text Sizing */}
          <h1 className="font-editorial italic font-bold text-7xl md:text-9xl lg:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            About Me
          </h1>
          
          {/* Unified Glow Bar */}
          <div className="h-1 w-24 md:w-32 mx-auto mt-8 md:mt-10 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      {/* Mobile: Grid cols 1 (Stack). Desktop: Grid cols 2 (Side by side) */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* LEFT COLUMN: TEXT & CONNECT */}
        {/* On mobile, we might want this second? Usually About text first is fine, but if you want Profile first, add 'order-2 md:order-1' */}
        <div className="space-y-12 order-2 md:order-1">
          <div className="border-l-2 border-[#5227ff] pl-6 md:pl-8">
            <h2 className="font-editorial text-4xl md:text-6xl italic font-bold mb-6 md:mb-8 tracking-tighter leading-[0.9] text-white">
              Groth on Film.
            </h2>
            <div className="space-y-6 text-base md:text-xl font-light text-zinc-400 leading-relaxed max-w-lg">
              <p>
                I’m <span className="text-white underline decoration-zinc-700 underline-offset-4">Cole Groth</span>. 
                I watch a movie every single day. It’s a non-negotiable part of my life, a habit I’ve kept since 2020.
              </p>
              <p>
                This site serves as a vault for those experiences! Outside of my work with FandomWire, I will write here.
                This serves as a curated collection of thoughts on the films that matter to me.
              </p>
              <p>
                I study Media Production at the University of Florida, but my real education happens on the big screen.
              </p>
            </div>
          </div>

          {/* CONNECT SECTION */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5227ff] mb-6 font-bold">
              Connect
            </h3>
            <ul className="space-y-4 font-editorial text-xl md:text-2xl italic">
              {[
                { label: 'Twitter (@cole_groth)', url: 'https://twitter.com/cole_groth' },
                { label: 'Instagram (@groth_cole)', url: 'https://instagram.com/groth_cole' },
                { label: 'YouTube (@GrothMovieReviews)', url: 'https://youtube.com/@GrothMovieReviews' },
                { label: 'Letterboxd (Cole Groth)', url: 'https://letterboxd.com/colegroth' },
              ].map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cursor-hover group block w-fit transition-transform duration-200 active:scale-95"
                  >
                    <span className="underline decoration-zinc-800 underline-offset-4 transition-colors duration-300 group-hover:text-[#5227ff] group-hover:decoration-[#5227ff]/30">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFILE CARD */}
        {/* Sticky on Desktop, Static on Mobile */}
        <div className="flex justify-center md:justify-end order-1 md:order-2 md:sticky md:top-32">
          <div className="w-full max-w-[300px] md:max-w-sm lg:max-w-md">
            <ProfileCard 
              avatarUrl="/me.png" 
              miniAvatarUrl="/me_2.jpg"
              behindGlowColor="rgba(82, 39, 255, 0.15)"
              behindGlowSize="35%"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;