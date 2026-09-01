import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, Clock, MapPin, Monitor, Star, Coins, Crown, Presentation, AlertTriangle, ShieldCheck } from 'lucide-react';

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
  const isMockUser = false // Force use of real database

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
        name: 'Test Worker',
        gradeTier: 'GOLD',
        bookings: []
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 flex flex-col justify-center items-center text-center">
            <Coins size={32} className="text-amber-500 mb-2" />
            <h3 className="text-xl font-bold">Patronage Points</h3>
            <p className="text-4xl font-extrabold text-[var(--primary)] mt-2">1,250</p>
            <p className="text-xs opacity-60 mt-1">Cooperative Equity Earned</p>
          </GlassCard>
          
          <GlassCard interactive className="p-6 flex flex-col justify-center items-center text-center border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-colors cursor-pointer group">
            <Presentation size={32} className="text-[var(--primary)] mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold">Slide Deck Generator</h3>
            <p className="text-sm opacity-70 mt-2 max-w-xs">One-click portfolio presentation of your skills and reviews.</p>
            <button className="mt-4 px-4 py-2 bg-[var(--primary)] text-white text-sm font-bold rounded-md">Generate Now</button>
          </GlassCard>

          <Link href="/bounties" className="block">
            <GlassCard interactive className="relative p-6 flex flex-col justify-center items-center text-center border-red-500/50 hover:bg-red-500/5 transition-colors group h-full">
              {/* Pulsing SOS Indicator */}
              <div className="absolute top-4 right-4 flex items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </div>
              
              <AlertTriangle size={32} className="text-red-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <h3 className="text-xl font-bold text-red-500">Bounty Board</h3>
              <p className="text-sm opacity-70 mt-2 max-w-xs text-[var(--foreground)]">Find urgent SOS requests and open community jobs nearby.</p>
              <div className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-bold rounded-md flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-1 ring-red-400">
                View Open Bounties
              </div>
            </GlassCard>
          </Link>
        </div>

        <div className="mb-8">
          <GlassCard className="p-8 border-[var(--primary)]/30 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none text-[var(--primary)]">
              <ShieldCheck size={180} />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-[var(--primary)] flex items-center gap-2">
              Financial Ledger & Equity <ShieldCheck size={24} />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="border-l-4 border-gray-400/30 pl-4">
                <p className="opacity-70 text-sm font-semibold uppercase tracking-wider mb-1">Total Lifetime Earnings</p>
                <p className="text-4xl font-extrabold text-[var(--foreground)]">₹12,450</p>
                <p className="text-xs opacity-60 mt-1 text-green-500 font-bold">+15% this month</p>
              </div>
              <div className="border-l-4 border-[var(--primary)] pl-4">
                <p className="opacity-70 text-sm font-semibold uppercase tracking-wider mb-1">Platform Fees Paid</p>
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-extrabold text-[var(--primary)]">₹0</p>
                </div>
                <p className="text-xs opacity-80 mt-1 font-bold bg-[var(--primary)]/10 text-[var(--primary)] inline-block px-2 py-0.5 rounded-sm">100% Payout Retained</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4">
                <p className="opacity-70 text-sm font-semibold uppercase tracking-wider mb-1">Cooperative Equity</p>
                <p className="text-4xl font-extrabold text-amber-500">1,250</p>
                <p className="text-xs opacity-60 mt-1">Patronage Points (Vested)</p>
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
            {activeBookings.map(booking => (
              <GlassCard key={booking.id} className="p-6 flex flex-col h-full border-[var(--primary)]/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{booking.subcategory}</h3>
                    <p className="text-sm opacity-70">for {booking.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-[var(--primary)]">₹{booking.workerPayout.toFixed(2)}</div>
                    <div className="text-[10px] font-bold uppercase opacity-60 px-2 py-0.5 bg-[var(--primary)]/10 rounded-sm mt-1 inline-block">
                      {booking.status}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
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

  const pendingBookings = customerProfile.bookings.filter(b => b.status === 'PENDING');

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-[var(--foreground)]">Welcome, {customerProfile.name.split(' ')[0]}</h1>
        <p className="opacity-70 text-lg">Manage your bookings and profile.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2 text-[var(--primary)]">Awaiting Worker Confirmation</h2>
      
      {pendingBookings.length === 0 ? (
        <GlassCard className="p-8 text-center opacity-70">
          <p>You have no pending booking requests.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingBookings.map(booking => (
            <GlassCard key={booking.id} className="p-6 flex flex-col h-full border-[var(--primary)]/30">
              <div className="flex justify-between items-start mb-4">
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
    </div>
  )
}
