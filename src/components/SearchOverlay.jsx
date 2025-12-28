import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/reviews'; 
import LightPillar from '../blocks/LightPillar';

const SearchOverlay = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) inputRef.current.focus();
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = reviews.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.director.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center pt-32 animate-fade-in transition-opacity duration-300 overflow-hidden">
      
      {/* 1. BACKGROUND LAYER */}
      <LightPillar 
        topColor="#5227FF" 
        bottomColor="#000000" 
        intensity={.3} 
        pillarWidth={2.5}
        rotationSpeed={0.2}
      />

      {/* 2. UI CONTENT LAYER */}
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 text-zinc-500 hover:text-white font-mono text-xl tracking-widest uppercase transition-colors z-10"
      >
        [CLOSE]
      </button>

      <div className="w-full max-w-5xl px-6 flex flex-col h-full relative z-10">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH ARCHIVE..."
          className="w-full bg-transparent border-b-2 border-white/20 text-white font-editorial italic font-bold text-5xl md:text-7xl py-4 focus:outline-none focus:border-[#5227ff] transition-colors placeholder:text-zinc-800 uppercase"
        />
        
        <p className="font-mono text-zinc-600 text-xs mt-4 tracking-[0.2em] uppercase mb-16">
          Searching by Title or Director...
        </p>

        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {results.map((item) => {
                const route = item.type === 'feature' ? `/review/${item.id}` : `/daily/${item.id}`;
                return (
                  <Link 
                    to={route} 
                    key={item.id} 
                    onClick={onClose}
                    className="group flex items-start gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="w-24 h-16 shrink-0 rounded bg-zinc-800 overflow-hidden">
                      <img 
                        src={item.heroImage} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 grayscale group-hover:grayscale-0" 
                        alt="" 
                      />
                    </div>
                    <div>
                      <h3 className="font-editorial italic font-bold text-3xl text-white group-hover:text-[#5227ff] transition-colors leading-[0.85] uppercase">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                         <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
                           {item.year}
                         </span>
                         <span className="w-1 h-1 rounded-full bg-zinc-700" />
                         <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
                           {item.type === 'feature' ? 'Review' : 'Vault Entry'}
                         </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : query && (
             <div className="text-center text-zinc-700 font-editorial italic text-3xl mt-20">
               No records found in the archive.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;