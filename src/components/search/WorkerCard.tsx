import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Star, ShieldCheck, MapPin, Monitor } from 'lucide-react';
import Link from 'next/link';

export interface WorkerCardProps {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  gradeTier: string;
  cumulativeRating: number;
  reviewCount: number;
  price: number;
  priceUnit: string;
  distanceKm: number;
  isOnline: boolean;
  vouched: boolean;
  avatar: string;
}

export function WorkerCard({ worker }: { worker: WorkerCardProps }) {
  const getBadgeColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'bg-gray-800 text-gray-100 border-gray-400';
      case 'GOLD': return 'bg-yellow-600 text-white border-yellow-300';
      case 'SILVER': return 'bg-gray-400 text-white border-gray-200';
      case 'BRONZE': return 'bg-orange-800 text-white border-orange-400';
      default: return 'bg-[var(--primary)] text-white';
    }
  };

  return (
    <Link href={`/book/${worker.id}`} className="group block h-full">
      <style>{`
        @keyframes badgeShine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          15% { transform: translateX(200%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-badge-shine {
          animation: badgeShine 4s ease-in-out infinite;
        }
      `}</style>
      <GlassCard interactive className="p-5 flex flex-col h-full relative overflow-hidden group hover:border-[var(--primary)] transition-colors">
        {/* Vouch indicator */}
        {worker.vouched && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full text-xs font-extrabold backdrop-blur-md overflow-hidden shadow-sm">
            {/* The Verification Shine Sweep */}
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-badge-shine pointer-events-none" />
            <ShieldCheck size={14} className="drop-shadow-sm" /> 
            <span className="drop-shadow-sm">Vouched</span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-full border-2 border-[var(--glass-border)] object-cover shadow-sm" />
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)] pr-16 group-hover:text-[var(--primary)] transition-colors">{worker.name}</h3>
            <p className="text-sm opacity-80 mb-2">{worker.category} • {worker.subcategory}</p>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${getBadgeColor(worker.gradeTier)}`}>
              {worker.gradeTier}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto border-t border-[var(--glass-border)] pt-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={16} fill="currentColor" />
              <span className="text-[var(--foreground)]">{worker.cumulativeRating.toFixed(1)}</span> 
              <span className="text-sm font-normal text-[var(--foreground)] opacity-60">({worker.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-sm opacity-70 mt-1">
              {worker.isOnline ? <Monitor size={14} /> : <MapPin size={14} />}
              {worker.isOnline ? 'Online/Remote' : `${worker.distanceKm} km away`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold text-[var(--primary)]">₹{worker.price}</div>
            <div className="text-[10px] font-bold opacity-60 uppercase">{worker.priceUnit.replace('_', ' ')}</div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
