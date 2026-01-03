import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient'; 
import DotGrid from '../blocks/DotGrid';
import ReviewStars from '../blocks/ReviewStars';
import SEO from '../components/SEO';

// === UTILS ===
const parseStars = (str) => {
  if (!str) return 0;
  const full = (str.match(/★/g) || []).length;
  const half = str.includes('½') ? 0.5 : 0;
  return full + half;
};

const getMonthFromDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split(' ');
  return parts[0] || '';
};

// === CUSTOM DROPDOWN ===
const CustomDropdown = ({ options, value, onChange, placeholder = "Select" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(value === option ? '' : option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 md:h-10 px-4 rounded-xl border flex items-center gap-2 transition-all duration-300 font-mono text-[10px] md:text-xs uppercase tracking-widest min-w-[120px] justify-between
          ${value ? 'bg-[#5227ff]/20 border-[#5227ff] text-white shadow-[0_0_15px_rgba(82,39,255,0.3)]' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`absolute top-full left-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 transition-all duration-200 origin-top
        ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
          {options.map((opt) => (
            <button key={opt} onClick={() => handleSelect(opt)} className={`text-left px-3 py-2 rounded-lg text-[10px] md:text-xs font-mono uppercase tracking-widest transition-colors ${value === opt ? 'bg-[#5227ff] text-white' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// === LOGIC TOGGLE ===
const ModeToggle = ({ mode, setMode }) => {
  const options = [{ label: 'Exact', mobile: '=', val: 'eq' }, { label: '& Up', mobile: '≥', val: 'gte' }, { label: '& Down', mobile: '≤', val: 'lte' }];
  const activeIndex = options.findIndex(o => o.val === mode);
  return (
    <div className="relative flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 h-7 md:h-8 w-24 md:w-48 shrink-0">
      <div className="absolute top-0.5 bottom-0.5 bg-[#5227ff] rounded shadow-[0_0_10px_#5227ff] transition-all duration-300 ease-out z-0" style={{ left: `${activeIndex * (100/3)}%`, width: '33.33%' }} />
      {options.map((opt) => (
        <button key={opt.val} onClick={() => setMode(opt.val)} className="relative z-10 flex-1 h-full flex items-center justify-center text-white transition-colors focus:outline-none group">
          <span className="hidden md:block text-[10px] uppercase tracking-widest font-mono opacity-80 group-hover:opacity-100">{opt.label}</span>
          <span className="md:hidden text-xs font-bold font-sans">{opt.mobile}</span>
        </button>
      ))}
    </div>
  );
};

// === FILTER BAR ===
const FilterBar = ({ search, setSearch, rating, setRating, mode, setMode, month, setMonth, sort, setSort }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const handleStarClick = (i) => {
    const val = i + 1;
    setRating(rating === val ? val - 0.5 : rating === val - 0.5 ? 0 : val);
  };
  return (
    <div className="sticky top-20 md:top-24 z-40 w-full max-w-5xl mx-auto px-4 md:px-6 mb-8 md:mb-12">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <input type="text" placeholder="Search films..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 md:h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs md:text-sm text-white focus:outline-none focus:border-[#5227ff] focus:bg-white/10 transition-all font-mono tracking-wide" />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-zinc-600 group-focus-within:text-[#5227ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex gap-2">
             <CustomDropdown options={months} value={month} onChange={setMonth} placeholder="All Months" />
             <button onClick={() => setSort(s => s === 'newest' ? 'oldest' : 'newest')} className="h-9 md:h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-[10px] md:text-xs text-white uppercase tracking-widest font-mono transition-colors">{sort === 'newest' ? 'Newest ↓' : 'Oldest ↑'}</button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <button key={i} onClick={() => handleStarClick(i)} className="relative group p-0.5 focus:outline-none active:scale-90">
                  <span className="text-xl md:text-2xl text-zinc-800 block">★</span>
                  <span className={`absolute inset-0 p-0.5 text-xl md:text-2xl text-[#5227ff] ${rating >= i + 1 ? 'opacity-100' : 'opacity-0'}`}>★</span>
                  {rating === i + 0.5 && <span className="absolute inset-0 p-0.5 text-xl md:text-2xl text-[#5227ff] overflow-hidden w-[50%]">★</span>}
                </button>
              ))}
            </div>
            {rating > 0 && <button onClick={() => setRating(0)} className="hidden md:block text-[10px] text-zinc-500 hover:text-white font-mono uppercase tracking-widest">[Clear]</button>}
          </div>
          <div className={`transition-all duration-300 ${rating > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}><ModeToggle mode={mode} setMode={setMode} /></div>
        </div>
      </div>
    </div>
  );
};

// === JOURNAL ENTRY ===
const JournalEntry = ({ item, allItems, SETTINGS, getRatingData, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const entryRef = useRef(null);
  const data = getRatingData(item.ratingStars); 
  
  // LOGIC FIX: Find index in Master List (Oldest -> Newest)
  const chronologicalIndex = allItems.findIndex(r => r._id === item._id);
  const displayEntryNum = chronologicalIndex + 1;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (entryRef.current) obs.observe(entryRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Link to={`/daily/${item.slug?.current || item._id}`} ref={entryRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`group relative flex flex-col md:flex-row gap-4 md:gap-8 w-full transition-all duration-700 mb-8 md:mb-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {!isMobile && <style dangerouslySetInnerHTML={{ __html: `.journal-entry-${item._id}:hover .entry-title { color: ${data.color} !important; text-shadow: 0 0 25px ${data.color}55 !important; }`}} />}
      
      {/* Left Column (Metadata) */}
      <div className="hidden md:flex flex-col items-end w-24 shrink-0 pt-1 text-right relative z-20">
        <span className="font-mono text-[#5227ff] text-[10px] font-bold tracking-widest mb-1">#{String(displayEntryNum).padStart(3, '0')}</span>
        <span className="font-mono text-white/40 text-[9px] uppercase tracking-widest">{item.publishedDate}</span>
        <div className={`mt-8 w-2.5 h-2.5 rounded-full border border-white/20 transition-all duration-300 ${isHovered ? 'scale-150 border-transparent' : 'bg-black'} journal-entry-${item._id}`} style={{ backgroundColor: isHovered ? data.color : '#0a0a0a' }} />
      </div>

      {/* Right Column (Content) */}
      <div className={`journal-entry-${item._id} flex-1 flex flex-col relative pb-6 md:pb-12 border-l border-white/5 md:border-none pl-6 md:pl-0`}>
        <div className="md:hidden flex items-center gap-3 mb-3">
          <span className="font-mono text-[#5227ff] text-xs font-bold tracking-widest">#{String(displayEntryNum).padStart(3, '0')}</span>
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-white/50 text-[10px] uppercase tracking-widest">{item.publishedDate}</span>
        </div>
        
        {/* Image Container with Fallback */}
        <div className="entry-border relative w-full aspect-[2.35/1] overflow-hidden rounded-lg border border-white/10 bg-zinc-900 transition-all duration-500">
          <img 
            src={item.heroImage} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x1080/000000/333333?text=IMAGE+NOT+FOUND'; }} 
            className="w-full h-full object-cover transition-all duration-700 md:group-hover:scale-105" 
            style={{ objectPosition: 'center 20%', filter: (isMobile || isHovered) ? 'grayscale(0%) saturate(1.1)' : 'grayscale(100%) opacity(0.7)' }} 
            alt={item.title} 
          />
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${!isMobile && isHovered ? 'opacity-100' : 'opacity-0'}`}>
             <p className="font-editorial italic text-xl md:text-3xl text-white px-8 text-center drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">"{item.verdict}"</p>
          </div>
        </div>

        {/* Title & Stars */}
        <div className="flex flex-col mt-4 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h2 className={`entry-title ${SETTINGS.fontTitle} text-3xl md:text-5xl text-white uppercase leading-[0.85] tracking-tighter transition-all duration-300`}>{item.title}</h2>
              <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Dir. {item.director} <span className="text-white/20 mx-1">|</span> {item.year}</div>
            </div>
            
            <div className={`transform transition-all duration-500 ${(isMobile || isHovered) ? 'opacity-100' : 'opacity-0'}`}>
                <ReviewStars rating={item.ratingStars} isVisible={isHovered || isMobile} className="text-lg md:text-xl" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// === MAIN PAGE ===
const DailyVault = () => {
  const [page, setPage] = useState(1);
  const [allVaultItems, setAllVaultItems] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 20;

  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0); 
  const [ratingMode, setRatingMode] = useState('eq');
  const [monthFilter, setMonthFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await client.fetch(`*[_type == "vaultReview"] | order(publishedDate asc, title asc) {
          ...,
          slug { current }
        }`);
        setAllVaultItems(data);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchReviews();
  }, []);

  const filteredItems = useMemo(() => {
    let output = [...allVaultItems];
    if (search) {
      const q = search.toLowerCase();
      output = output.filter(i => i.title?.toLowerCase().includes(q) || i.director?.toLowerCase().includes(q));
    }
    if (monthFilter) output = output.filter(i => getMonthFromDate(i.publishedDate) === monthFilter);
    if (ratingFilter > 0) {
      output = output.filter(i => {
        const r = parseStars(i.ratingStars);
        return ratingMode === 'eq' ? r === ratingFilter : ratingMode === 'gte' ? r >= ratingFilter : r <= ratingFilter;
      });
    }
    
    output.sort((a, b) => {
      const dateA = new Date(a.publishedDate);
      const dateB = new Date(b.publishedDate);

      if (sortOrder === 'newest') {
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return a.title.localeCompare(b.title);
      } else {
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return a.title.localeCompare(b.title);
      }
    });

    return output;
  }, [allVaultItems, search, monthFilter, ratingFilter, ratingMode, sortOrder]);

  const visibleItems = useMemo(() => filteredItems.slice(0, page * itemsPerPage), [filteredItems, page]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SETTINGS = {
    spectrum: { 10: '#00ff41', 9: '#88ff00', 8: '#ccff00', 7: '#eeff00', 6: '#ffff00', 5: '#ffcc00', 4: '#ff9500', 3: '#ff5e00', 2: '#ff0000', 1: '#8b0000', 0: '#ffffff' },
    fontTitle: "font-editorial italic font-bold", 
  };

  const getRatingData = (stars) => {
    if (!stars) return { color: '#fff' };
    const score = Math.round(parseStars(stars) * 2);
    return { color: SETTINGS.spectrum[Math.max(0, Math.min(10, score))] || '#ffffff' };
  };

  return (
    <> 
      <SEO title="The Vault | Groth on Film" description="Daily film log and archive." />
      <div className="bg-[#080808] min-h-screen pb-32 relative overflow-x-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000000]" />
          <DotGrid dotSize={2} gap={40} baseColor="#333" activeColor="#5227FF" proximity={200} shockRadius={200} />
        </div>
        <div className="relative z-10 pt-32 md:pt-48 pb-12 px-6 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-mono text-[#5227ff] text-[10px] uppercase tracking-[0.4em] mb-6 block bg-white/5 px-4 py-2 rounded-full border border-white/5">:: The Archive ::</span>
            <h1 className="font-editorial italic font-bold text-7xl md:text-[11rem] uppercase tracking-tighter text-white leading-none drop-shadow-2xl">Daily Log</h1>
          </div>
        </div>
        <FilterBar search={search} setSearch={setSearch} rating={ratingFilter} setRating={setRatingFilter} mode={ratingMode} setMode={setRatingMode} month={monthFilter} setMonth={setMonthFilter} sort={sortOrder} setSort={setSortOrder} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-0">
          <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-[#5227ff] via-white/10 to-transparent hidden md:block" />
          {isLoading ? (
             <div className="text-center py-20 text-white/40 font-mono uppercase tracking-widest">Loading Archive...</div>
          ) : filteredItems.length === 0 ? (
             <div className="text-center py-20 text-white/40 font-mono uppercase tracking-widest">No entries found.</div>
          ) : (
            <div className="flex flex-col gap-2"> 
              {visibleItems.map((item) => (
                <JournalEntry 
                  key={item._id} 
                  item={item} 
                  allItems={allVaultItems} 
                  SETTINGS={SETTINGS} 
                  getRatingData={getRatingData} 
                  isMobile={isMobile} 
                />
              ))}
            </div>
          )}
          {visibleItems.length < filteredItems.length && (
            <div className="text-center mt-20 relative z-20">
              <button onClick={() => setPage(p => p + 1)} className="px-8 py-3 rounded-full border border-white/20 bg-black text-white font-mono text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors">Load More Entries</button>
            </div>
          )}
          {visibleItems.length >= filteredItems.length && filteredItems.length > 0 && (
            <div className="text-center mt-32 relative z-10 opacity-50"><p className="font-mono text-[10px] uppercase tracking-[0.2em]">End of Log</p></div>
          )}
        </div>
      </div>
    </>
  );
};

export default DailyVault;