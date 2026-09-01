import React, { HTMLAttributes } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export function GlassCard({ 
  children, 
  className = '', 
  interactive = false, 
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-[var(--radius-glass)] overflow-hidden transition-all duration-300 ${
        interactive ? 'hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
