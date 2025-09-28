import React from 'react';

interface SplineBackgroundProps {
  className?: string;
}

const SplineBackground = ({ className = "" }: SplineBackgroundProps) => {
  return (
    <div 
      className={`fixed inset-0 w-full h-full z-0 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <iframe 
        src='https://my.spline.design/squarechipsfallinginplace-U4083N4iKLWxR3OB2szyoFtL/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        style={{ pointerEvents: 'auto' }} // Allow interaction with the iframe
      ></iframe>
      
      {/* Dark overlay for better text contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"
        style={{ zIndex: 1, pointerEvents: 'none' }}
      />
    </div>
  );
};

export default SplineBackground;
