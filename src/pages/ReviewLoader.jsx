import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Aurora from '../blocks/Aurora'; 

const ReviewLoader = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); 
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadReview = async () => {
      try {
        const modules = import.meta.glob('./archive/*.js', { eager: true });
        const keys = Object.keys(modules);
        const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchKey = keys.find(key => key.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanId));
        
        if (matchKey) setContent(modules[matchKey].default);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadReview();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !content) return <div className="min-h-screen bg-black" />;

  // Smart Distribution Logic
  const p = content.paragraphs || [];
  const s = content.stills || [];
  const q = content.quotes || [];
  const quarter = Math.ceil(p.length / 4);

  return (
    <div className="relative min-h-screen bg-black text-zinc-300 selection:bg-accent selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <Aurora colorStops={["#5227ff", "#ff9ffc", "#5227ff"]} speed={0.2} />
      </div>

      <header className="relative z-10 h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img src={content.heroImage} className="w-full h-full object-cover opacity-60" style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }} alt="" />
        </div>
        <div className="relative z-20 text-center flex flex-col items-center gap-4">
          <div className="text-[#FFD700] text-2xl tracking-[0.5em] mb-2 font-bold italic">{content.ratingStars}</div>
          <h1 className="font-editorial text-[8rem] md:text-[10rem] font-bold italic text-white leading-[0.85] uppercase tracking-tighter">{content.title}</h1>
          <div className="font-mono text-[9px] uppercase tracking-[0.5em] text-white font-bold mt-6 bg-black/40 backdrop-blur-md px-8 py-3 border border-white/10 rounded-sm">Directed by {content.director} // {content.year}</div>
        </div>
      </header>

      <article className="relative z-10 max-w-lg mx-auto px-6 py-20 leading-relaxed text-lg font-light">
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-16 font-mono text-[10px] uppercase tracking-[0.4em] text-white font-black">
          <span>Cole Groth</span>
          <span>{content.publishedDate}</span>
        </div>

        {/* SECTION 1 */}
        <div className="space-y-8 mb-16">{p.slice(0, quarter).map((text, i) => <p key={i}>{text}</p>)}</div>

        {/* STILL 1 */}
        {s[0] && (
          <figure className="relative my-20">
            <div className="absolute -inset-[3px] bg-white/10 blur-[2px] rounded-sm opacity-50" />
            <img src={s[0]} className="relative w-full rounded-sm shadow-2xl border-t border-l border-white/20" alt="" />
          </figure>
        )}

        {/* SECTION 2 */}
        <div className="space-y-8 mb-16">{p.slice(quarter, quarter * 2).map((text, i) => <p key={i}>{text}</p>)}</div>

        {/* QUOTE 1 */}
        {q[0] && (
          <blockquote className="my-20 relative p-12 text-center bg-white/[0.03] border border-white/10 rounded-sm">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#5227ff]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#5227ff]" />
            <p className="font-editorial text-4xl italic text-white leading-tight">"{q[0]}"</p>
          </blockquote>
        )}

        {/* SECTION 3 */}
        <div className="space-y-8 mb-16">{p.slice(quarter * 2, quarter * 3).map((text, i) => <p key={i}>{text}</p>)}</div>

        {/* STILL 2 */}
        {s[1] && (
          <figure className="relative my-20">
            <div className="absolute -inset-[3px] bg-white/10 blur-[2px] rounded-sm opacity-50" />
            <img src={s[1]} className="relative w-full rounded-sm shadow-2xl border-t border-l border-white/20" alt="" />
          </figure>
        )}

        {/* SECTION 4 */}
        <div className="space-y-8 mb-16">{p.slice(quarter * 3).map((text, i) => <p key={i}>{text}</p>)}</div>
        
        {/* QUOTE 2 */}
        {q[1] && (
           <p className="font-editorial text-2xl italic text-white text-center border-y border-white/5 py-10 my-16 opacity-60">"{q[1]}"</p>
        )}

        <div className="mt-32 p-16 border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent text-center shadow-2xl">
          <p className="font-mono text-[9px] uppercase text-[#5227ff] mb-6 tracking-[0.6em] font-black">The Verdict</p>
          <p className="font-editorial text-5xl italic text-white leading-tight">{content.verdict}</p>
        </div>
      </article>

      {/* AUTOMATIC SUGGESTIONS FOOTER */}
      <div className="border-t border-white/10 mt-20 relative z-20 bg-black/90 backdrop-blur-md py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-16 text-center font-bold">Suggested Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {(() => {
              const allModules = import.meta.glob('./archive/*.js', { eager: true });
              return Object.entries(allModules)
                .filter(([path]) => path.toLowerCase().includes('feature'))
                .map(([_, m]) => m.default)
                .filter(r => r.title !== content.title) 
                .sort((a,b) => new Date(b.publishedDate) - new Date(a.publishedDate))
                .slice(0, 2)
                .map((item, i) => (
                  <Link key={i} to={`/reviews?id=${item.title.replace(/\s+/g, '-').toLowerCase()}`} className="group flex gap-8 items-center">
                    <div className="w-28 h-36 bg-zinc-900 shrink-0 overflow-hidden border border-white/10 group-hover:border-[#5227ff] shadow-xl">
                       <img src={item.heroImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-editorial text-3xl italic text-white group-hover:text-[#5227ff] transition-colors leading-none tracking-tighter">{item.title}</h4>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-2">Dir. {item.director} // {item.year}</p>
                      <div className="text-[#FFD700] text-xs mt-3 tracking-widest font-bold">{item.ratingStars}</div>
                    </div>
                  </Link>
                ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewLoader;