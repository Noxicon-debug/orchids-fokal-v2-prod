import React from 'react';

export const TribalChevron: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#075ce6' }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0 L30 20 L0 40 Z" fill={color} opacity="0.15" />
    <path d="M30 0 L60 20 L30 40 Z" fill={color} opacity="0.25" />
    <path d="M60 0 L90 20 L60 40 Z" fill={color} opacity="0.15" />
    <path d="M90 0 L120 20 L90 40 Z" fill={color} opacity="0.25" />
  </svg>
);

export const TribalZigzag: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#075ce6' }) => (
  <svg className={className} viewBox="0 0 200 30" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="0,15 20,0 40,15 60,0 80,15 100,0 120,15 140,0 160,15 180,0 200,15" stroke={color} strokeWidth="2" opacity="0.2" />
    <polyline points="0,30 20,15 40,30 60,15 80,30 100,15 120,30 140,15 160,30 180,15 200,30" stroke={color} strokeWidth="2" opacity="0.1" />
  </svg>
);

export const TribalDiamond: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#075ce6' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke={color} strokeWidth="1.5" opacity="0.15" />
    <path d="M50 20 L80 50 L50 80 L20 50 Z" stroke={color} strokeWidth="1.5" opacity="0.2" />
    <path d="M50 35 L65 50 L50 65 L35 50 Z" fill={color} opacity="0.1" />
  </svg>
);

export const TribalSteps: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#075ce6' }) => (
  <svg className={className} viewBox="0 0 100 80" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 80 L0 60 L20 60 L20 40 L40 40 L40 20 L60 20 L60 0" stroke={color} strokeWidth="2" opacity="0.2" />
    <path d="M100 80 L100 60 L80 60 L80 40 L60 40 L60 20 L40 20 L40 0" stroke={color} strokeWidth="2" opacity="0.15" />
  </svg>
);

export const TribalCorner: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#075ce6' }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" aria-hidden="true">
    {/* Outer triangle border */}
    <path d="M0 200 L0 140 L60 200 Z" fill={color} opacity="0.08" />
    <path d="M0 200 L0 100 L100 200 Z" fill={color} opacity="0.05" />
    {/* Chevron rows */}
    <g opacity="0.15">
      <path d="M10 190 L25 175 L40 190 L25 205 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M50 180 L65 165 L80 180 L65 195 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M90 170 L105 155 L120 170 L105 185 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M130 160 L145 145 L160 160 L145 175 Z" stroke={color} strokeWidth="1.5" fill="none" />
    </g>
    {/* Zigzag line */}
    <polyline points="5,120 25,100 45,120 65,100 85,120 105,100 125,120 145,100 165,120 185,100" stroke={color} strokeWidth="2" opacity="0.12" fill="none" />
    {/* Small diamonds */}
    <g opacity="0.1">
      <path d="M20 60 L35 75 L20 90 L5 75 Z" fill={color} />
      <path d="M70 40 L85 55 L70 70 L55 55 Z" fill={color} />
      <path d="M130 20 L145 35 L130 50 L115 35 Z" fill={color} />
    </g>
    {/* Dots */}
    <g fill={color} opacity="0.15">
      <circle cx="30" cy="30" r="3" />
      <circle cx="60" cy="20" r="2" />
      <circle cx="90" cy="35" r="3" />
      <circle cx="170" cy="50" r="2" />
      <circle cx="180" cy="80" r="3" />
    </g>
  </svg>
);

export const TribalSidePanel: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`tribal-side ${className}`} aria-hidden="true">
    <div className="tribal-side-inner">
      {/* Repeating chevron bands */}
      <div className="tribal-band" style={{ marginTop: '10%' }}>
        <TribalChevron color="#0864ed" className="w-full h-8" />
      </div>
      <div className="tribal-band" style={{ marginTop: '8%' }}>
        <TribalZigzag color="#0864ed" className="w-full h-6" />
      </div>
      {/* Diamond cluster */}
      <div className="tribal-diamond-row" style={{ marginTop: '12%' }}>
        <TribalDiamond color="#0864ed" className="w-12 h-12" />
        <TribalDiamond color="#0864ed" className="w-16 h-16" />
        <TribalDiamond color="#0864ed" className="w-12 h-12" />
      </div>
      <div className="tribal-band" style={{ marginTop: '10%' }}>
        <TribalZigzag color="#0864ed" className="w-full h-6" />
      </div>
      {/* Step pattern */}
      <div style={{ marginTop: '8%', display: 'flex', justifyContent: 'center' }}>
        <TribalSteps color="#0864ed" className="w-24 h-20" />
      </div>
      <div className="tribal-band" style={{ marginTop: '8%' }}>
        <TribalChevron color="#0864ed" className="w-full h-8" />
      </div>
      <div className="tribal-band" style={{ marginTop: '8%' }}>
        <TribalZigzag color="#0864ed" className="w-full h-6" />
      </div>
    </div>
  </div>
);

export default TribalSidePanel;
