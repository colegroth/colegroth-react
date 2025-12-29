import React, { useState } from 'react';

const ReviewStars = ({ rating, isVisible = true, className = "" }) => {
  // sessionKey ensures animation restarts on every mount/refresh
  const [sessionKey] = useState(Math.random());

  if (!rating) return null;

  return (
    <div key={`${rating}-${sessionKey}`} className={`flex items-center gap-0.5 ${className}`}>
      {rating.split('').map((char, i) => (
        <span 
          key={i} 
          className="text-[#FFD700] inline-block font-bold"
          style={{ 
            transition: `all 0.8s cubic-bezier(0.2, 1, 0.3, 1)`,
            transitionDelay: isVisible ? `${i * 70}ms` : '0ms',
            transform: isVisible ? 'scale(1.15) rotate(360deg)' : 'scale(0) rotate(0deg)',
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? `drop-shadow(0 0 12px rgba(255, 215, 0, 0.5))` : 'none'
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default ReviewStars;