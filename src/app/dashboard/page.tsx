import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, Clock, MapPin, Monitor, Star, Coins, Crown, Presentation, AlertTriangle, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  let userId = ''
  
  const cookieStore = await cookies()
  const mockUserId = cookieStore.get('mock_user_id')?.value
  if (mockUserId) {
    userId = mockUserId
  }

  // Real Auth fallback
  if (!userId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return <div>Please log in.</div>
    }
    userId = user.id
  }

  const role = cookieStore.get('mock_user_role')?.value || 'CUSTOMER'
  const isMockUser = !!cookieStore.get('mock_user_id')?.value

  if (role === 'WORKER') {
    let workerProfile: any = null;

    if (!isMockUser) {
      try {
        workerProfile = await prisma.workerProfile.findFirst({
          where: { userId },
          include: {
            bookings: {
              include: { customer: true },
              orderBy: { createdAt: 'desc' }
            }
          }
        });
      } catch (e) {
        console.warn("Database connection failed in Dashboard (WORKER), bypassing for prototype.");
      }
    } else {
      // Create a mock worker profile
      workerProfile = {
        name: 'Rajesh Kumar',
        gradeTier: 'GOLD',
        currentStreak: 5,
        longestStreak: 12,
        bookings: [
          { status: 'PENDING', customer: { name: 'Amit Singh' } },
          { status: 'ACCEPTED', customer: { name: 'Priya Sharma' } }
        ]
      }
    }

    if (!workerProfile) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <GlassCard className="p-8 text-center">
            <h1 className="text-2xl font-bold">Profile Setup Required</h1>
            <p className="opacity-70 mt-2">Please complete onboarding to access your dashboard.</p>
          </GlassCard>
        </div>
      );
    }

    const activeBookings = workerProfile.bookings.filter((b: any) => b.status === 'PENDING' || b.status === 'ACCEPTED');

    return (
      <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-[var(--foreground)]">Welcome, {workerProfile.name.split(' ')[0]}</h1>
            <p className="opacity-70 text-lg">Manage your jobs and worker metrics.</p>
          </div>
          <div className="text-right">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/30 font-bold">
               <Crown size={18} /> {workerProfile.gradeTier} TIER
             </div>
          </div>
        </div>

        {/* Targeted B2B Ad Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Presentation size={100} className="text-blue-400" />
          </div>
          <div className="relative z-10 md:w-2/3 mb-4 md:mb-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-white/70 rounded text-[10px] font-black uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/5">
              <span>Sponsored</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Upgrade to Havells Pro Series</h3>
            <p className="text-blue-200 text-sm opacity-90 max-w-lg">Exclusive 30% discount on professional-grade wiring and MCBs for Top-Tier GullyGigs electricians.</p>
          </div>
          <div className="relative z-10">
            <button className="px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
              Claim Discount <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Streak Widget */}
          <GlassCard className="p-6 flex flex-col justify-center items-center text-center border-orange-500/30 group hover:border-orange-500/60 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl text-orange-500 filter drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">🔥</span>
            </div>
            <div className="z-10 flex flex-col items-center">
              <div className="bg-orange-500/10 text-orange-500 rounded-full p-2 mb-2">
                <span className="text-xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold text-orange-500">Activity Streak</h3>
              <p className="text-4xl font-extrabold text-[var(--foreground)] mt-2 drop-shadow-sm">{workerProfile.currentStreak} <span className="text-lg opacity-70">Days</span></p>
              <div className="mt-3 w-full bg-[var(--glass-border)] rounded-full h-1.5 overflow-hidden">
                 <div className="bg-orange-500 h-full w-[41%] shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
              </div>
              <p className="text-[10px] opacity-60 mt-2 font-bold tracking-wider">BEST STREAK: {workerProfile.longestStreak} DAYS</p>
            </div>
          </GlassCard>

          <Link href="/dashboard/equity" className="block h-full">
            <GlassCard interactive className="p-6 flex flex-col justify-center items-center text-center border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group h-full relative overflow-hidden">
              <div className="absolute top-2 right-2 text-amber-500/50 group-hover:text-amber-500 transition-colors">
                 <ArrowRight size={16} className="-rotate-45" />
              </div>
              <Coins size={32} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold">Patronage Points</h3>
              <p className="text-4xl font-extrabold text-[var(--primary)] mt-2">1,250</p>
              <p className="text-xs opacity-60 mt-1">View Co-op Equity &rarr;</p>
            </GlassCard>
          </Link>
          
          <GlassCard className="p-6 flex flex-col justify-between border-[var(--primary)]/30 group hover:border-[var(--primary)]/60 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star size={20} className="text-[var(--primary)] fill-[var(--primary)]" />
                  Performance
                </h3>
                <p className="text-xs opacity-70 mt-1">Last 4 weeks</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-[var(--foreground)]">4.9</p>
                <p className="text-xs font-bold text-green-500">Top 5%</p>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-20 gap-2 mt-4 px-2">
              <div className="w-full bg-[var(--primary)]/20 rounded-t-sm h-[60%] relative group-hover:bg-[var(--primary)]/40 transition-colors"><div className="absolute -top-5 w-full text-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">12</div></div>
              <div className="w-full bg-[var(--primary)]/20 rounded-t-sm h-[80%] relative group-hover:bg-[var(--primary)]/50 transition-colors"><div className="absolute -top-5 w-full text-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">15</div></div>
              <div className="w-full bg-[var(--primary)]/40 rounded-t-sm h-[40%] relative group-hover:bg-[var(--primary)]/60 transition-colors"><div className="absolute -top-5 w-full text-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">8</div></div>
              <div className="w-full bg-[var(--primary)] rounded-t-sm h-[100%] shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] relative"><div className="absolute -top-5 w-full text-center text-[10px] font-bold">19</div></div>
            </div>
            <div className="flex justify-between text-[10px] opacity-50 mt-2 px-2 uppercase font-bold tracking-wider">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </GlassCard>

          <Link href="/bounties" className="block h-full">
            <GlassCard interactive className="relative p-6 flex flex-col justify-center items-center text-center border-red-500/50 hover:bg-red-500/5 transition-colors group h-full">
              {/* Pulsing SOS Indicator */}
              <div className="absolute top-4 right-4 flex items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </div>
              
              <AlertTriangle size={32} className="text-red-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <h3 className="text-xl font-bold text-red-500">Bounty Board</h3>
              <p className="text-sm opacity-70 mt-2 max-w-xs text-[var(--foreground)]">Find urgent SOS jobs nearby.</p>
              <div className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-bold rounded-md flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-1 ring-red-400">
                View Open Bounties
              </div>
            </GlassCard>
          </Link>
        </div>

        <div className="mb-8">
          <GlassCard className="p-8 border-[var(--primary)]/30 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none text-[var(--primary)] transform group-hover:scale-110 group-hover:rotate-12">
              <ShieldCheck size={240} />
            </div>
            
            <div className="flex justify-between items-end mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  Financial Ledger & Equity <ShieldCheck size={24} className="animate-pulse" />
                </h2>
                <p className="opacity-70 text-sm mt-1">Real-time breakdown of your earnings and cooperative ownership.</p>
              </div>
              <button className="text-sm font-bold bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] px-4 py-2 rounded-lg transition-colors">
                Download Statement
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="border-l-4 border-[var(--glass-border)] pl-5 flex flex-col justify-between hover:border-green-500/50 transition-colors">
                <div>
                  <p className="opacity-70 text-xs font-bold uppercase tracking-widest mb-2">Total Lifetime Earnings</p>
                  <p className="text-4xl font-extrabold text-[var(--foreground)] font-mono tracking-tight">₹12,450</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-500 font-bold bg-green-500/10 w-fit px-3 py-1 rounded-full">
                  <span className="text-lg leading-none">↑</span> +15% this month
                </div>
              </div>

              <div className="border-l-4 border-[var(--primary)] pl-5 flex flex-col justify-between group/fees">
                <div>
                  <p className="opacity-70 text-xs font-bold uppercase tracking-widest mb-2">Platform Fees Paid</p>
                  <div className="flex items-center gap-3">
                    <p className="text-4xl font-extrabold text-[var(--primary)] font-mono tracking-tight">₹0</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)] inline-block px-3 py-1 rounded-full border border-[var(--primary)]/20 shadow-sm shadow-[var(--primary)]/10">
                    100% Payout Retained
                  </p>
                  <div className="w-full bg-[var(--glass-border)] h-1.5 mt-3 rounded-full overflow-hidden">
                    <div className="bg-[var(--primary)] h-full w-full rounded-full group-hover/fees:animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 pl-5 flex flex-col justify-between hover:border-amber-400 transition-colors">
                <div>
                  <p className="opacity-70 text-xs font-bold uppercase tracking-widest mb-2">Cooperative Equity</p>
                  <p className="text-4xl font-extrabold text-amber-500 font-mono tracking-tight">1,250 <span className="text-lg opacity-50 font-sans">pts</span></p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs opacity-70">Patronage Points (Vested)</p>
                  <Crown size={16} className="text-amber-500 opacity-50" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <h2 className="text-2xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2 text-[var(--primary)]">Active Job Requests</h2>
        
        {activeBookings.length === 0 ? (
          <GlassCard className="p-8 text-center opacity-70">
            <p>You have no active job requests right now.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBookings.map((booking: any, index: number) => (
              <GlassCard key={booking.id || `mock-${index}`} className="p-0 overflow-hidden flex flex-col h-full border-[var(--primary)]/30 group hover:border-[var(--primary)]/60 transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.15)]">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                          {booking.status}
                        </span>
                        {booking.status === 'PENDING' && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--foreground)]">{booking.subcategory}</h3>
                      <p className="text-sm flex items-center gap-1 opacity-70 mt-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" /> New Customer
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-[var(--primary)]">₹{booking.workerPayout?.toFixed(2) || '0.00'}</div>
                      <p className="text-xs opacity-60">Estimated Payout</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-3 text-sm opacity-80 bg-[var(--glass-bg)] p-3 rounded-lg border border-[var(--glass-border)]">
                      <MapPin size={16} className="text-[var(--primary)] shrink-0" />
                      <span className="truncate">Local area (Customer: {booking.customer?.name})</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm opacity-80 bg-[var(--glass-bg)] p-3 rounded-lg border border-[var(--glass-border)]">
                      <Clock size={16} className="text-[var(--primary)] shrink-0" />
                      <span>{booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString() : 'ASAP'}</span>
                    </div>
                  </div>
                </div>
                
                {booking.status === 'PENDING' ? (
                  <div className="grid grid-cols-2 divide-x divide-[var(--glass-border)] border-t border-[var(--glass-border)] bg-[var(--glass-bg)]/50">
                    <button className="py-4 text-center font-bold text-red-500 hover:bg-red-500/10 transition-colors">
                      Decline
                    </button>
                    <button className="py-4 text-center font-extrabold text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors">
                      Accept Job
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 divide-x divide-[var(--glass-border)] border-t border-[var(--glass-border)] bg-[var(--glass-bg)]/50">
                    <button className="py-4 flex justify-center items-center gap-2 font-bold text-[var(--foreground)] hover:bg-white/5 transition-colors">
                      <MessageCircle size={18} /> Message
                    </button>
                    <button className="py-4 text-center font-extrabold text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors">
                      Complete Job
                    </button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}

        <div className="mt-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Recent Reviews</h2>
            <Link href="#" className="text-sm font-bold text-[var(--primary)] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock Review 1 */}
            <GlassCard className="p-6 relative group overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-1 text-amber-500">
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                 </div>
                 <span className="text-xs opacity-50 font-bold">2d ago</span>
               </div>
               <p className="opacity-90 italic mb-4 text-sm">&quot;Excellent work on the plumbing leak! Arrived on time and cleaned up afterwards. Highly recommended.&quot;</p>
               <div className="flex items-center gap-3 border-t border-[var(--glass-border)] pt-4">
                 <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold text-xs">
                   RS
                 </div>
                 <div>
                   <p className="text-sm font-bold">Rajesh S.</p>
                   <p className="text-[10px] opacity-60">Verified Customer</p>
                 </div>
               </div>
            </GlassCard>

            {/* Mock Review 2 */}
            <GlassCard className="p-6 relative group overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-1 text-amber-500">
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="opacity-30" />
                 </div>
                 <span className="text-xs opacity-50 font-bold">1w ago</span>
               </div>
               <p className="opacity-90 italic mb-4 text-sm">&quot;Good job fixing the fan. Was a bit delayed due to traffic but communicated well.&quot;</p>
               <div className="flex items-center gap-3 border-t border-[var(--glass-border)] pt-4">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                   AK
                 </div>
                 <div>
                   <p className="text-sm font-bold">Anita K.</p>
                   <p className="text-[10px] opacity-60">Verified Customer</p>
                 </div>
               </div>
            </GlassCard>
            
            {/* Mock Review 3 */}
            <GlassCard className="p-6 relative group overflow-hidden opacity-70">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-1 text-amber-500">
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                 </div>
                 <span className="text-xs opacity-50 font-bold">1m ago</span>
               </div>
               <p className="opacity-90 italic mb-4 text-sm">&quot;Perfect service. Fast and reliable!&quot;</p>
               <div className="flex items-center gap-3 border-t border-[var(--glass-border)] pt-4">
                 <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-xs">
                   MD
                 </div>
                 <div>
                   <p className="text-sm font-bold">Mohit D.</p>
                   <p className="text-[10px] opacity-60">Verified Customer</p>
                 </div>
               </div>
            </GlassCard>
          </div>
        </div>

      </div>
    )
  }

  // CUSTOMER FLOW
  let customerProfile: any = null;

  if (!isMockUser) {
    try {
      customerProfile = await prisma.customerProfile.findFirst({
        where: { userId: userId },
        include: {
          bookings: {
            include: { worker: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (e) {
      console.warn("Database connection failed in Dashboard (CUSTOMER), bypassing for prototype.");
    }
  } else {
    // Create a mock customer profile
    const mockUserName = cookieStore.get('mock_user_name')?.value || 'Test Customer';
    customerProfile = {
      name: mockUserName,
      premiumStatus: true,
      bookings: [
        {
          id: 'mock-booking-1',
          subcategory: 'Emergency Plumbing SOS',
          worker: null,
          totalAmount: 1320,
          status: 'PENDING',
          mode: 'OFFLINE',
          scheduledTime: new Date(),
          estimatedHours: 1
        },
        {
          id: 'mock-booking-2',
          subcategory: 'Electrical Repair',
          worker: { name: 'Vikram Electrician' },
          totalAmount: 550,
          status: 'PENDING',
          mode: 'OFFLINE',
          scheduledTime: new Date(Date.now() + 86400000), // Tomorrow
          estimatedHours: 1
        },
        {
          id: 'mock-booking-3',
          subcategory: 'Deep Cleaning',
          worker: { name: 'Rajesh S.' },
          totalAmount: 1200,
          status: 'COMPLETED',
          mode: 'OFFLINE',
          scheduledTime: new Date(Date.now() - 86400000 * 2), // 2 days ago
          estimatedHours: 4
        }
      ]
    }
  }

  if (!customerProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-bold">Profile Setup Required</h1>
          <p className="opacity-70 mt-2">Please complete onboarding to access your dashboard.</p>
        </GlassCard>
      </div>
    );
  }

  const pendingBookings = customerProfile.bookings.filter((b: any) => b.status === 'PENDING');
  const completedBookings = customerProfile.bookings.filter((b: any) => b.status === 'COMPLETED');

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-[var(--foreground)]">Welcome, {customerProfile.name.split(' ')[0]}</h1>
        <p className="opacity-70 text-lg">Manage your bookings and profile.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2 text-[var(--primary)]">Awaiting Worker Confirmation</h2>
      
      {pendingBookings.length === 0 ? (
        <GlassCard className="p-8 text-center opacity-70 mb-12">
          <p>You have no pending booking requests.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {pendingBookings.map((booking: any) => (
            <GlassCard key={booking.id} className="p-6 flex flex-col h-full border-[var(--primary)]/30">
              <div className="flex justify-between items-start mb-4">
                 {/* ... existing card content for pending ... */}
                <div>
                  <h3 className="text-xl font-bold">{booking.subcategory}</h3>
                  <p className="text-sm opacity-70">with {booking.worker?.name || 'Open Bounty'}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[var(--primary)]">₹{booking.totalAmount.toFixed(2)}</div>
                  <div className="text-[10px] font-bold uppercase opacity-60 px-2 py-0.5 bg-[var(--primary)]/10 rounded-sm mt-1 inline-block">
                    {booking.status}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm opacity-80 mt-auto pt-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  {booking.mode === 'ONLINE' ? <Monitor size={16} /> : <MapPin size={16} />}
                  <span>{booking.mode === 'ONLINE' ? 'Virtual Consultation' : 'In-Person Service'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{booking.scheduledTime.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500 font-semibold">
                  <Clock size={16} />
                  <span>Est. {booking.estimatedHours} hours</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* COMPLETED BOOKINGS AND REVIEWS */}
      {completedBookings.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2 text-emerald-500">Completed Jobs (Requires Review)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedBookings.map((booking: any) => (
              <GlassCard key={booking.id} className="flex flex-col h-full border-emerald-500/30 relative overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{booking.subcategory}</h3>
                      <p className="text-sm opacity-70">with {booking.worker?.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-emerald-500">₹{booking.totalAmount.toFixed(2)}</div>
                      <div className="text-[10px] font-bold uppercase opacity-60 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-sm mt-1 inline-block">
                        COMPLETED
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl">
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Star size={16} className="text-amber-500" /> Rate your experience</h4>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} className="text-3xl hover:scale-125 transition-transform text-white/10 hover:text-amber-500 focus:text-amber-500 hover:drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Leave a review for this worker..." 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 focus:outline-none transition-colors mb-3 resize-none h-20" 
                    />
                    <button className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors">
                      Submit Review
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

    </div>
  )
}
