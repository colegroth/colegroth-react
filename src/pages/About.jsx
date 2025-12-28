import React from 'react';
import ProfileCard from '../blocks/ProfileCard';
import Aurora from '../blocks/Aurora';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center">
      
      {/* 1. BACKGROUND ANIMATION */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <Aurora colorStops={["#5227ff", "#ff9ffc", "#5227ff"]} speed={0.1} />
      </div>

      {/* 2. UNIFIED HEADER SECTION */}
      <div className="relative z-10 pt-48 pb-16 px-8 text-center w-full">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Metadata Tag */}
          <span className="font-mono text-white/40 text-[10px] uppercase tracking-[0.4em] mb-6 block">
            :: Identification ::
          </span>
          
          {/* Mega Title standardized to 10rem */}
          <h1 className="font-editorial italic font-bold text-7xl md:text-[10rem] uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            About Me
          </h1>
          
          {/* Unified Glow Bar */}
          <div className="h-1 w-32 mx-auto mt-10 bg-[#5227ff] shadow-[0_0_20px_#5227ff]" />
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start pb-32">
        
        {/* LEFT COLUMN: TEXT & CONNECT */}
        <div className="space-y-12">
          <div className="border-l-2 border-[#5227ff] pl-8">
            <h2 className="font-editorial text-5xl md:text-6xl italic font-bold mb-8 tracking-tighter leading-[0.85] text-white">
              Groth on Film.
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light text-zinc-400 leading-relaxed max-w-lg">
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
            <ul className="space-y-3 font-editorial text-2xl italic">
              <li>
                <a href="https://twitter.com/cole_groth" target="_blank" rel="noopener noreferrer" className="hover:text-[#5227ff] underline decoration-zinc-700 underline-offset-4 transition-colors block">
                  Twitter (@cole_groth)
                </a>
              </li>
              <li>
                <a href="https://instagram.com/groth_cole" target="_blank" rel="noopener noreferrer" className="hover:text-[#5227ff] underline decoration-zinc-700 underline-offset-4 transition-colors block">
                  Instagram (@groth_cole)
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@GrothMovieReviews" target="_blank" rel="noopener noreferrer" className="hover:text-[#5227ff] underline decoration-zinc-700 underline-offset-4 transition-colors block">
                  YouTube (@GrothMovieReviews)
                </a>
              </li>
              <li>
                <a href="https://letterboxd.com/colegroth" target="_blank" rel="noopener noreferrer" className="hover:text-[#5227ff] underline decoration-zinc-700 underline-offset-4 transition-colors block">
                  Letterboxd (Cole Groth)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFILE CARD */}
        <div className="flex justify-center md:justify-end sticky top-48">
          <div className="w-full max-w-sm lg:max-w-md">
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