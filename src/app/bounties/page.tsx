import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { GlassCard } from '@/components/ui/GlassCard';
import { MapPin, Clock, AlertTriangle, Briefcase, IndianRupee } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function BountyBoardPage() {
  // 1. Authorization: Only Workers should access this page.
  let userId = '';
  const cookieStore = await cookies();
  
  const mockUserId = cookieStore.get('mock_user_id')?.value;
  const isMockUser = !!mockUserId;

  if (mockUserId) {
    userId = mockUserId;
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) userId = user.id;
  }

  const role = cookieStore.get('mock_user_role')?.value;
  if (!userId || role !== 'WORKER') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-md">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="opacity-70 mt-2">The Community Bounty Board is strictly accessible to verified Workers.</p>
        </GlassCard>
      </div>
    );
  }

  // 2. Fetch Open Bounties (workerId is null, status is PENDING)
  let openBounties: any[] = [];
  if (!isMockUser) {
    try {
      openBounties = await prisma.booking.findMany({
        where: {
          workerId: null,
          status: 'PENDING'
        },
        include: {
          customer: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (e) {
      console.warn("Database connection failed in Bounty Board, bypassing for prototype.");
    }
  } else {
    openBounties = [
      {
        id: 'bounty-1',
        subcategory: 'Emergency Plumbing',
        customer: { name: 'Rahul S.' },
        workerPayout: 850,
        description: 'Pipe burst in the kitchen, flooding the floor! Need immediate assistance.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'bounty-2',
        subcategory: 'Electrical Short',
        customer: { name: 'Priya K.' },
        workerPayout: 600,
        description: 'Main breaker keeps tripping. Half the house has no power.',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-red-500 flex items-center gap-3">
          Community Bounty Board 
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </h1>
        <p className="opacity-70 text-lg">Claim urgent SOS requests and open community jobs.</p>
      </div>

      {openBounties.length === 0 ? (
        <GlassCard className="p-12 text-center opacity-70">
          <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">No Open Bounties</h2>
          <p className="mt-2">It's quiet right now. Check back later for urgent jobs.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openBounties.map(bounty => (
            <GlassCard key={bounty.id} className="relative p-6 flex flex-col h-full border-red-500/50 hover:bg-red-500/5 transition-colors overflow-hidden group">
              {/* Emergency Pulse Background */}
              <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-500 font-bold text-xs rounded-sm mb-2 uppercase tracking-wide border border-red-500/30">
                    <AlertTriangle size={12} /> SOS EMERGENCY
                  </div>
                  <h3 className="text-xl font-bold">{bounty.subcategory}</h3>
                  <p className="text-sm opacity-70">Requested by {bounty.customer.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-red-500 flex items-center justify-end">
                    ₹{bounty.workerPayout.toFixed(0)}
                  </div>
                  <div className="text-[10px] font-bold uppercase opacity-60 mt-1 flex justify-end gap-1 text-red-500">
                    Includes 1.5x Surge
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 text-sm opacity-80 mt-auto pt-4 border-t border-[var(--glass-border)] space-y-2">
                <p className="line-clamp-2 mb-2 font-medium opacity-90">{bounty.description}</p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-400" />
                  <span>Local Area (Bounty Mode)</span>
                </div>
                <div className="flex items-center gap-2 text-red-400 font-semibold">
                  <Clock size={16} />
                  <span>Posted {new Date(bounty.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
              
              {/* Note: This button is currently a mockup. In the real app, it would trigger a Server Action to claim the job */}
              <button className="relative z-10 mt-4 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2">
                <AlertTriangle size={18} /> Claim Bounty
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
