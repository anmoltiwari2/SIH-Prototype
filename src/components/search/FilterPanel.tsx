'use client'

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { CATEGORIES } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All Categories';
  const currentMode = searchParams.get('mode') || 'ALL';
  const currentMinRating = parseFloat(searchParams.get('minRating') || '0');

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All Categories' && value !== 'ALL' && value !== '0') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <GlassCard className="p-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold mb-6 border-b border-[var(--glass-border)] pb-2 text-[var(--primary)]">Filters</h2>
      
      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Category</label>
        <select 
          className="w-full bg-transparent border border-[var(--glass-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] [&>option]:text-black"
          value={currentCategory}
          onChange={(e) => updateParam('category', e.target.value)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Mode */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Service Mode</label>
        <div className="flex bg-[var(--foreground)]/5 rounded-md p-1 border border-[var(--glass-border)]">
          {['ALL', 'OFFLINE', 'ONLINE'].map(mode => (
            <button
              key={mode}
              className={`flex-1 text-xs font-bold py-1.5 rounded-sm transition-colors ${currentMode === mode ? 'bg-[var(--primary)] text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-[var(--foreground)]/5'}`}
              onClick={() => updateParam('mode', mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-2">
        <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Min Rating: {currentMinRating} <span className="text-amber-500">★</span></label>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.5" 
          value={currentMinRating}
          onChange={(e) => updateParam('minRating', e.target.value)}
          className="w-full accent-[var(--primary)]"
        />
      </div>
    </GlassCard>
  );
}
