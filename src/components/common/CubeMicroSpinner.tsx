import React from 'react';

interface CubeMicroSpinnerProps {
  size?: number;
  isSolving?: boolean;
  className?: string;
}

export const CubeMicroSpinner: React.FC<CubeMicroSpinnerProps> = ({
  size = 20,
  isSolving = false,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      title="CubePilot 3³"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform duration-300 ${
          isSolving ? 'animate-spin duration-1000' : 'group-hover:rotate-45'
        }`}
      >
        {/* Isometric Cube Outline */}
        <g stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
          {/* Top Face */}
          <path
            d="M16 3L28 10L16 17L4 10L16 3Z"
            className="fill-surface stroke-border-strong group-hover:fill-accent/20 transition-colors"
          />
          {/* Top Face Inner Grid Lines */}
          <path d="M12 5.33L24 12.33M8 7.67L20 14.67" strokeOpacity="0.4" />
          <path d="M20 5.33L8 12.33M24 7.67L12 14.67" strokeOpacity="0.4" />

          {/* Left Face */}
          <path
            d="M4 10V22L16 29V17L4 10Z"
            className="fill-surface-hover stroke-border-strong group-hover:fill-surface-active transition-colors"
          />
          {/* Left Face Inner Grid Lines */}
          <path d="M4 14L16 21M4 18L16 25" strokeOpacity="0.35" />
          <path d="M8 12.33V24.33M12 14.67V26.67" strokeOpacity="0.35" />

          {/* Right Face */}
          <path
            d="M16 17L28 10V22L16 29V17Z"
            className="fill-surface-active stroke-border-strong group-hover:fill-surface transition-colors"
          />
          {/* Right Face Inner Grid Lines */}
          <path d="M16 21L28 14M16 25L28 18" strokeOpacity="0.35" />
          <path d="M20 14.67V26.67M24 12.33V24.33" strokeOpacity="0.35" />

          {/* Center Point highlight */}
          <circle cx="16" cy="17" r="1" className="fill-accent stroke-none" />
        </g>
      </svg>
    </div>
  );
};
