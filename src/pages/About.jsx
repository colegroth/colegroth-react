import React from 'react';
import ProfileCard from '../blocks/ProfileCard';
import Aurora from '../blocks/Aurora';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <Aurora colorStops={["#5227ff", "#ff9ffc", "#5227ff"]} speed={0.1} />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        
        {/* Left: Text */}
        <div className="order-2 md:order-1 space-y-8">
          <h1 className="font-editorial text-7xl italic font-bold mb-8">Groth on Film.</h1>
          <div className="space-y-6 text-lg font-light text-zinc-400 leading-relaxed max-w-lg">
            <p>
              I’m <span className="text-white font-normal border-b border-accent/50 pb-0.5">Cole Groth</span>. 
              I watch a movie every single day. It’s a non-negotiable part of my life, a habit I’ve kept since 2020.
            </p>
            <p>
              This site serves as a vault for those experiences. It is not an aggregator. It is not a news site. It is a curated collection of thoughts on the films that matter to me.
            </p>
            <p>
              I study Media Production at the University of Florida, but my real education happens in the dark of a movie theater.
            </p>
          </div>
          
          <div className="pt-8">
            <a href="mailto:colegroth@ufl.edu" className="inline-block border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-widest">
              Contact Me
            </a>
          </div>
        </div>

        {/* Right: The Profile Card */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <ProfileCard />
        </div>

      </div>
    </div>
  );
};

export default About;