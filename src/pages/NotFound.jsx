import React from 'react';
import { Link } from 'react-router-dom';
import Aurora from '../blocks/Aurora';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Noise */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <Aurora colorStops={["#ff0000", "#5227ff", "#000000"]} speed={0.5} />
      </div>
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="relative z-10 text-center px-6">
        <span className="font-mono text-[#5227ff] text-xs uppercase tracking-[0.5em] mb-4 block">
          :: Error 404 ::
        </span>
        
        <h1 className="font-editorial italic font-bold text-[12vw] md:text-[10rem] leading-[0.8] uppercase tracking-tighter mb-6 drop-shadow-2xl">
          Scene <br /> Missing
        </h1>
        
        <p className="font-mono text-white/50 text-xs md:text-sm uppercase tracking-widest mb-12 max-w-md mx-auto leading-relaxed">
          The footage you are looking for has been cut from the final edit.
        </p>

        <Link 
          to="/" 
          className="cursor-hover inline-block bg-white text-black font-mono text-[11px] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-full hover:bg-[#5227ff] hover:text-white transition-all duration-300 active:scale-90 shadow-2xl"
        >
          Return to Set
        </Link>
      </div>
    </div>
  );
};

export default NotFound;