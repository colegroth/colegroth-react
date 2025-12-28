import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { reviews } from '../data/reviews'; 
import ReviewLoader from './ReviewLoader';

const FeatureReview = () => {
  const { id } = useParams(); 
  const [review, setReview] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  const SETTINGS = {
    titleParallax: 0.25,      
    imageParallax: 0.01,      
    quoteParallax: 0.01,      
    heroShift: '15%',       
    heroGradientStrength: '85%', 
    heroBreatheScale: 1.05,   
    photoBreathe: true,     
    photoBreatheScale: 1.015, 
    photoShadow: true,      
    paddingAfterMeta: 'mt-4',   
    paddingBeforeFooter: 'mt-6' 
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Find review based on clean ID slug
    const found = reviews.find(r => r.id === id); 
    if (found) setReview(found);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (!review) return <div className="pt-40 text-center text-white font-mono uppercase tracking-widest">Review Not Found</div>;

  const p = review.paragraphs || [];
  const q = Math.ceil(p.length / 4);
  const chunks = [p.slice(0, q), p.slice(q, q * 2), p.slice(q * 2, q * 3), p.slice(q * 3)];

  return (
    <div className="bg-black min-h-screen selection:bg-[#5227ff] selection:text-white overflow-x-hidden">
      <style>{`
        @keyframes heroBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(${SETTINGS.heroBreatheScale}); }
        }
        @keyframes photoBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(${SETTINGS.photoBreatheScale}); }
        }
        @keyframes starPop {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-hero-breathe { animation: heroBreathe 60s ease-in-out infinite; }
        .animate-photo-breathe { animation: photoBreathe 12s ease-in-out infinite; }
        .animate-star { opacity: 0; animation: starPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .constant-glow { text-shadow: 0 0 15px rgba(255,255,255,0.3), 0 0 30px rgba(82,39,255,0.2); }
        .star-glow { filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.7)); }
        
        .font-meta { 
          font-family: sans-serif; 
          font-weight: 900; 
          font-style: italic; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          transform: skewX(-5deg); 
        }
        
        .footer-glow {
          text-shadow: 0 0 10px rgba(82, 39, 255, 0.8), 0 0 20px rgba(82, 39, 255, 0.4);
        }
      `}</style>

      {/* HERO SECTION */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
           <img 
            src={review.heroImage} 
            className="w-full h-full object-cover opacity-60 animate-hero-breathe"
            style={{ 
              objectPosition: `center ${SETTINGS.heroShift}`,
              maskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black ${SETTINGS.heroGradientStrength}, transparent 100%)`, 
              WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black ${SETTINGS.heroGradientStrength}, transparent 100%)` 
            }}
          />
        </div>

        <div 
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
          style={{ transform: `translateY(${scrollY * -SETTINGS.titleParallax}px)` }} 
        >
          <div className="flex gap-3 text-[#FFD700] text-4xl md:text-5xl mb-8 star-glow drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
             {(review.ratingStars || "★★★★★").split('').map((s, i) => (
               <span key={i} className="animate-star" style={{ animationDelay: `${i * 0.15}s` }}>{s}</span>
             ))}
          </div>

          <h1 className="font-editorial italic text-7xl md:text-[11rem] font-black uppercase tracking-tighter leading-[0.8] text-white constant-glow drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] max-w-6xl">
            {review.title}
          </h1>

          <p className="mt-8 font-meta text-sm md:text-base text-white/90 drop-shadow-[0_5px_10px_rgba(0,0,0,1)]">
            Directed by {review.director} // {review.year}
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-8 relative z-20 pb-24">
        <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-0">
          <div className="flex items-center gap-3 font-editorial italic font-black text-lg text-white tracking-widest">
            <div className="h-2.5 w-2.5 rounded-full bg-[#5227ff] shadow-[0_0_10px_#5227ff]" />
            COLE GROTH
          </div>
          <time className="font-meta text-sm text-white/40 tracking-[0.1em]">{review.publishedDate}</time>
        </div>

        <div className={`font-sans text-[16px] md:text-[18px] leading-[1.8] text-white/90 space-y-8 ${SETTINGS.paddingAfterMeta}`}>
          {chunks[0].map((text, i) => <p key={i} dangerouslySetInnerHTML={{__html: text}} />)}
          
          {review.stills?.[0] && (
            <div 
              className={`my-16 rounded-2xl overflow-hidden border border-white/10 ${SETTINGS.photoShadow ? 'shadow-[0_20px_40px_rgba(0,0,0,0.8)]' : ''}`}
              style={{ transform: `translateY(${scrollY * -SETTINGS.imageParallax}px)` }}
            >
              <img src={review.stills[0]} className={`w-full saturate-[0.8] ${SETTINGS.photoBreathe ? 'animate-photo-breathe' : ''}`} alt="" />
            </div>
          )}

          {chunks[1].map((text, i) => <p key={i} dangerouslySetInnerHTML={{__html: text}} />)}

          {review.quotes?.[0] && (
            <div 
              className="relative w-full my-20 py-12 border-y border-[#5227ff]/30 bg-gradient-to-r from-[#5227ff]/5 via-transparent to-[#5227ff]/5 text-center"
              style={{ transform: `translateY(${scrollY * -SETTINGS.quoteParallax}px)` }}
            >
              <blockquote className="font-serif italic text-xl md:text-2xl font-bold text-white px-12 drop-shadow-2xl leading-relaxed">
                "{review.quotes[0]}"
              </blockquote>
            </div>
          )}

          {chunks[2].map((text, i) => <p key={i} dangerouslySetInnerHTML={{__html: text}} />)}

          {review.stills?.[1] && (
            <div 
              className={`my-16 rounded-2xl overflow-hidden border border-white/10 ${SETTINGS.photoShadow ? 'shadow-[0_20px_40px_rgba(0,0,0,0.8)]' : ''}`}
              style={{ transform: `translateY(${scrollY * -SETTINGS.imageParallax}px)` }}
            >
              <img src={review.stills[1]} className={`w-full aspect-video object-cover saturate-[0.8] ${SETTINGS.photoBreathe ? 'animate-photo-breathe' : ''}`} alt="" />
            </div>
          )}

          {chunks[3].map((text, i) => <p key={i} dangerouslySetInnerHTML={{__html: text}} />)}
        </div>

        <div className={`${SETTINGS.paddingBeforeFooter} pt-12 border-t border-white/20 text-center`}>
          <p className="font-editorial italic font-black text-sm text-white footer-glow tracking-widest">
            {(review.footerText || review.title + " is in theaters now").toUpperCase()}
          </p>
        </div>
      </article>

      {/* ReviewLoader now passes the clean currentReviewId */}
      <ReviewLoader currentReviewId={review.id} />
    </div>
  );
};

export default FeatureReview;