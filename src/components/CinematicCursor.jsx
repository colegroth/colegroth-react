import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CinematicCursor = () => {
  const cursorRef = useRef(null);
  const location = useLocation();
  
  // States
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isActive, setIsActive] = useState(false); // To prevent flash on initial load

  useEffect(() => {
    // Activate after mount to prevent layout thrashing
    setIsActive(true);

    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => {
      setIsClicking(false);
      // Optional: Add a "shutter sound" logic here if you really want to go wild
    };

    // Global Hover Detection
    const handleMouseOver = (e) => {
      // Check if target is a Link, Button, or explicitly marked
      const target = e.target.closest('a, button, .cursor-hover');
      setIsHovering(!!target);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [location]); // Re-bind on route change if necessary

  if (!isActive) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center will-change-transform text-white"
    >
      {/* THE CONTAINER
         - Base size: 12px (Focus Dot)
         - Hover size: 144px (Viewfinder)
         - Click size: 130px (Shutter Tension/Constrict)
      */}
      <div 
        className={`relative flex items-center justify-center transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isHovering 
            ? (isClicking ? 'w-[130px] h-[75px]' : 'w-36 h-24') // Constrict on click
            : 'w-3 h-3' // Idle dot
          }
        `}
      >
        {/* --- STATE 1: IDLE FOCUS DOT --- */}
        <div className={`absolute inset-0 bg-white rounded-full transition-opacity duration-150 ${isHovering ? 'opacity-0' : 'opacity-100'}`} />

        {/* --- STATE 2: ACTIVE VIEWFINDER UI --- */}
        <div className={`absolute inset-0 transition-opacity duration-150 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Shutter Flash Overlay (Triggers on Click) */}
          <div className={`absolute inset-0 bg-white transition-opacity duration-75 ${isClicking ? 'opacity-100' : 'opacity-0'}`} />

          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"/>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"/>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"/>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"/>
          
          {/* Center Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50">
             <div className="w-3 h-0.5 bg-white"/>
             <div className="h-3 w-0.5 bg-white absolute"/>
          </div>

          {/* UI Data Overlays */}
          <div className="absolute top-1 left-2 flex items-center gap-1.5">
              {/* REC Dot: Blinks normally, turns solid/fast on click */}
              <div className={`w-2 h-2 bg-red-500 rounded-full ${isClicking ? 'animate-none opacity-100 scale-125' : 'animate-pulse'}`}/> 
              <span className="font-mono text-[8px] font-bold tracking-widest">REC</span>
          </div>
          <div className="absolute bottom-1 right-2 font-mono text-[8px] tracking-widest opacity-80">
             [ 16:9 ]
          </div>
           <div className="absolute bottom-1 left-2 font-mono text-[8px] tracking-widest opacity-80">
             ISO 800
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicCursor;