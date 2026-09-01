import React from 'react';
import { GlassCard } from './GlassCard';

export interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'circular';
}

export function SkeletonLoader({ className = '', variant = 'card' }: SkeletonLoaderProps) {
  if (variant === 'text') {
    return (
      <div className={`h-4 w-full rounded-md bg-foreground/5 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div className={`rounded-full bg-foreground/5 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    );
  }

  // Default to card variant (glassmorphic skeleton)
  return (
    <GlassCard className={`relative overflow-hidden ${className}`}>
      {/* The base glass card acts as the skeleton frame, and we layer the shimmer on top */}
      <div className="absolute inset-0 animate-shimmer" />
    </GlassCard>
  );
}
