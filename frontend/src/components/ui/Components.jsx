import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className, onClick, noHover = false }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 p-6",
        !noHover && "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: "bg-slate-150 text-slate-900 border border-black",
    indigo: "bg-[#48d2e1]/20 text-black border border-black",
    emerald: "bg-emerald-100 text-emerald-950 border border-black",
    amber: "bg-amber-100 text-amber-950 border border-black",
    rose: "bg-rose-100 text-rose-950 border border-black",
  };
  
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]", variants[variant], className)}>
      {children}
    </span>
  );
};

export const SectionTitle = ({ title, icon: Icon, className }) => {
  return (
    <div className={cn("flex items-center gap-2 mb-4", className)}>
      {Icon && <Icon className="w-5 h-5 text-black stroke-[2.5]" />}
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
    </div>
  );
};

export const CompanyLogo = ({ company, className = "w-11 h-11", onClick }) => {
  const [useFallback, setUseFallback] = useState(!company?.logoUrl);

  if (useFallback || !company?.logoUrl) {
    let hash = 0;
    const name = company?.name || 'Startup';
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash);
    const colors = [
      ['#06b6d4', '#3b82f6'],
      ['#ec4899', '#8b5cf6'],
      ['#f59e0b', '#ef4444'],
      ['#10b981', '#3b82f6'],
      ['#8b5cf6', '#ec4899'],
      ['#6366f1', '#a855f7'],
      ['#f97316', '#eab308']
    ];
    const colorPair = colors[index % colors.length];

    const shapes = [
      <g key="1" opacity="0.8">
        <circle cx="40" cy="50" r="22" fill={colorPair[0]} />
        <circle cx="60" cy="50" r="22" fill={colorPair[1]} />
      </g>,
      <rect key="2" x="32" y="32" width="36" height="36" rx="8" transform="rotate(45 50 50)" fill={`url(#grad-${index})`} />,
      <g key="3">
        <circle cx="50" cy="50" r="28" stroke={colorPair[0]} strokeWidth="6" fill="none" />
        <circle cx="50" cy="50" r="14" fill={colorPair[1]} />
      </g>,
      <g key="4" opacity="0.85">
        <rect x="28" y="28" width="28" height="28" rx="6" fill={colorPair[0]} />
        <rect x="44" y="44" width="28" height="28" rx="6" fill={colorPair[1]} />
      </g>,
      <path key="5" d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" fill={`url(#grad-${index})`} />
    ];

    const shape = shapes[index % shapes.length];

    return (
      <div 
        onClick={onClick}
        className={cn("bg-slate-50 border-2 border-black flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm rounded-xl p-1.5", onClick && "cursor-pointer", className)}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorPair[0]} />
              <stop offset="100%" stopColor={colorPair[1]} />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="#f8fafc" />
          {shape}
        </svg>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={cn("bg-white border-2 border-black flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm rounded-xl p-1", onClick && "cursor-pointer", className)}
    >
      <img
        src={company.logoUrl}
        alt={company.name}
        className="w-full h-full object-contain mix-blend-multiply"
        onError={() => setUseFallback(true)}
      />
    </div>
  );
};
