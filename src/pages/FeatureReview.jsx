import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { client } from '../sanityClient'; 
import ReviewLoader from './ReviewLoader';
import ReviewStars from '../blocks/ReviewStars';
import SEO from '../components/SEO'; 

const FeatureReview = () => {
  const { id } = useParams(); 
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [starsVisible, setStarsVisible] = useState(false);
  const [copied, setCopied] = useState(false); 

  const SETTINGS = {
    titleParallax: 0.25, imageParallax: 0.01, quoteParallax: 0.01,      
    heroShift: '15%', heroGradientStrength: '85%', heroBreatheScale: 1.05,   
    photoBreathe: true, photoBreatheScale: 1.015, 
    paddingAfterMeta: 'mt-4', paddingBeforeFooter: 'mt-6' 
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReview = async () => {
      try {
        const query = `*[_type == "featureReview" && (slug.current == $id || _id == $id)][0]`;
        const data = await client.fetch(query, { id });
        setReview(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setStarsVisible(false);
    const timer = setTimeout(() => setStarsVisible(true), 150);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (loading) return <div className="pt-40 text-center text-white/50 font-mono uppercase tracking-widest">Loading...</div>;
  if (!review) return <div className="pt-40 text-center text-white font-mono uppercase tracking-widest">Review Not Found</div>;

  // === SAFE TEXT EXTRACTION ===
  const rawText = (() => {
    // Check Old Schema (paragraphs array)
    if (review.paragraphs && Array.isArray(review.paragraphs)) return review.paragraphs.join('\n\n');
    // Check New Schema (body)
    if (review.body) {
       if (typeof review.body === 'string') return review.body;
       if (Array.isArray(review.body)) {
         return review.body.map(block => 
           block.children ? block.children.map(c => c.text).join('') : (typeof block === 'string' ? block : '')
         ).join('\n\n');
       }
    }
    return "";
  })();

  // === LAYOUT CALCULATIONS ===
  const allParagraphs = rawText.split(/\n\s*\n/).filter(Boolean); 
  const total = allParagraphs.length;
  const quarter = total > 0 ? Math.ceil(total / 4) : 0;
  
  const chunk1 = allParagraphs.slice(0, quarter);
  const chunk2 = allParagraphs.slice(quarter, quarter * 2);
  const chunk3 = allParagraphs.slice(quarter * 2, quarter * 3);
  const chunk4 = allParagraphs.slice(quarter * 3);

  const renderText = (textArray) => (
    textArray.map((text, i) => (
      <p key={i} dangerouslySetInnerHTML={{__html: text.replace(/\n/g, "<br/>")}} />
    ))
  );

  return (
    <div className="bg-black min-h-screen selection:bg-[#5227ff] selection:text-white overflow-x-hidden relative">
       <SEO title={`${review.title} Review`} description={review.verdict} image={review.heroImage} />
      
      {/* Background Styles */}
      <style>{`
        @keyframes heroBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(${SETTINGS.heroBreatheScale}); } }
        @keyframes photoBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(${SETTINGS.photoBreatheScale}); } }
        .animate-hero-breathe { animation: heroBreathe 60s ease-in-out infinite; }
        .animate-photo-breathe { animation: photoBreathe 12s ease-in-out infinite; }
        .constant-glow { text-shadow: 0 0 15px rgba(255,255,255,0.3), 0 0 30px rgba(82,39,255,0.2); }
        .font-meta { font-family: sans-serif; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: 0.1em; transform: skewX(-5deg); }
        .footer-glow { text-shadow: 0 0 10px rgba(82, 39, 255, 0.8), 0 0 20px rgba(82, 39, 255, 0.4); }
      `}</style>

      {/* Hero Section */}
      <div className="relative w-full h-[100vh] overflow-hidden z-10">
        <div className="absolute inset-0 w-full h-full z-0">
           <img src={review.heroImage} className="w-full h-full object-cover opacity-60 animate-hero-breathe"
            style={{ objectPosition: `center ${SETTINGS.heroShift}`, maskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black ${SETTINGS.heroGradientStrength}, transparent 100%)`, WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black ${SETTINGS.heroGradientStrength}, transparent 100%)` }} alt="" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4" style={{ transform: `translateY(${scrollY * -SETTINGS.titleParallax}px)` }}>
          <div className="text-4xl md:text-5xl mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"><ReviewStars rating={review.ratingStars} isVisible={starsVisible} /></div>
          <h1 className="font-editorial italic text-7xl md:text-[11rem] font-black uppercase tracking-tighter leading-[0.8] text-white constant-glow drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] max-w-6xl">{review.title}</h1>
          <p className="mt-8 font-meta text-sm md:text-base text-white/90 drop-shadow-[0_5px_10px_rgba(0,0,0,1)]">Directed by {review.director} // {review.year}</p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-8 relative z-20 pb-8"> 
        <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-0">
          <div className="flex items-center gap-3 font-editorial italic font-black text-lg text-white tracking-widest"><div className="h-2.5 w-2.5 rounded-full bg-[#5227ff] shadow-[0_0_10px_#5227ff]" />COLE GROTH</div>
          <time className="font-meta text-sm text-white/40 tracking-[0.1em]">{review.publishedDate}</time>
        </div>

        <div className={`font-sans text-[16px] md:text-[18px] leading-[1.8] text-white/90 space-y-8 ${SETTINGS.paddingAfterMeta} [&_a]:text-[#5227ff] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 hover:[&_a]:decoration-[#5227ff] [&_a]:transition-colors [&_b]:text-white [&_b]:font-black [&_i]:font-serif [&_i]:italic [&_i]:text-white/80`}>
          
          {/* LAYOUT: 25% Text -> Still -> 25% Text -> Quote -> 25% Text -> Still -> 25% Text */}
          {renderText(chunk1)}
          {review.stills?.[0] && (<div className="my-14 rounded-2xl overflow-hidden border-2 border-[#5227ff]/40 shadow-[0_0_40px_rgba(82,39,255,0.3)] transition-all duration-500 ease-out md:hover:scale-[1.02] md:hover:shadow-[0_0_60px_rgba(82,39,255,0.6)] md:hover:border-[#5227ff]" style={{ transform: `translateY(${scrollY * -SETTINGS.imageParallax}px)` }}><img src={review.stills[0]} className={`w-full saturate-[0.8] ${SETTINGS.photoBreathe ? 'animate-photo-breathe' : ''}`} alt="" /></div>)}
          
          {renderText(chunk2)}
          {review.quotes?.[0] && (<div className="relative w-full my-12 py-12 border-y border-[#5227ff]/30 bg-gradient-to-r from-[#5227ff]/5 via-transparent to-[#5227ff]/5 text-center transition-all duration-500 ease-out md:hover:scale-[1.03] md:hover:bg-[#5227ff]/10 md:hover:border-[#5227ff]/60 cursor-default" style={{ transform: `translateY(${scrollY * -SETTINGS.quoteParallax}px)` }}><blockquote className="font-serif italic text-xl md:text-2xl font-bold text-white px-12 drop-shadow-2xl leading-relaxed pointer-events-none">"{review.quotes[0]}"</blockquote></div>)}
          
          {renderText(chunk3)}
          {review.stills?.[1] && (<div className="my-14 rounded-2xl overflow-hidden border-2 border-[#5227ff]/40 shadow-[0_0_40px_rgba(82,39,255,0.3)] transition-all duration-500 ease-out md:hover:scale-[1.02] md:hover:shadow-[0_0_60px_rgba(82,39,255,0.6)] md:hover:border-[#5227ff]" style={{ transform: `translateY(${scrollY * -SETTINGS.imageParallax}px)` }}><img src={review.stills[1]} className={`w-full aspect-video object-cover saturate-[0.8] ${SETTINGS.photoBreathe ? 'animate-photo-breathe' : ''}`} alt="" /></div>)}
          
          {renderText(chunk4)}
        </div>

        {/* VERDICT AND SCORE FOOTER */}
        <div className={`${SETTINGS.paddingBeforeFooter} pt-12 pb-4 border-t border-white/20 text-center relative z-20`}>
          <div className="flex flex-col items-center gap-6 mb-10">
              <div className="text-3xl md:text-4xl drop-shadow-[0_5px_15px_rgba(82,39,255,0.5)]">
                  <ReviewStars rating={review.ratingStars} isVisible={true} />
              </div>
              <p className="font-editorial italic font-black text-2xl md:text-3xl text-white footer-glow tracking-widest max-w-2xl leading-tight">
                "{review.verdict}"
              </p>
          </div>

          <p className="text-white/50 text-xs font-mono uppercase tracking-widest mb-10">
            {(review.footerText || review.title + " is in theaters now")}
          </p>

          <div className="flex justify-center items-center gap-6">
            <button onClick={handleCopy} className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#5227ff] hover:bg-[#5227ff]/10 transition-all duration-300 active:scale-95"><span className="font-mono text-[10px] uppercase tracking-widest text-white/60 group-hover:text-white">{copied ? "Link Copied!" : "Share Review"}</span></button>
            <div className="w-px h-4 bg-white/10"></div>
            <button onClick={scrollToTop} className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#5227ff] hover:bg-[#5227ff]/10 transition-all duration-300 active:scale-95"><span className="font-mono text-[10px] uppercase tracking-widest text-white/60 group-hover:text-white">Back to Top</span></button>
          </div>
        </div>
      </article>
      <ReviewLoader currentReviewId={review.id || review._id} />
    </div>
  );
};
export default FeatureReview;