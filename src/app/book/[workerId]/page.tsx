import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { BookingForm } from '@/components/booking/BookingForm';
import { GlassCard } from '@/components/ui/GlassCard';
import { Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export default async function BookingPage({ params }: { params: Promise<{ workerId: string }> }) {
  const { workerId } = await params;

  // Check auth and premium status
  let isPremiumMember = false;
  let customerId = '';
  
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get('mock_user_id')?.value;
  const isMockUser = false; // Force use of real database
  
  if (mockUserId) {
    customerId = mockUserId;
  }
  
  if (!customerId) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) customerId = user.id;
  }

  let worker: any = null;

  if (!isMockUser) {
    try {
      if (customerId) {
        const profile = await prisma.customerProfile.findUnique({ where: { userId: customerId } });
        if (profile) isPremiumMember = profile.premiumStatus;
      }

      // Fetch the worker
      worker = await prisma.workerProfile.findUnique({
        where: { id: workerId },
        include: {
          servicesOffered: true
        }
      });
    } catch (e) {
      console.warn("Database connection failed in Booking Page, bypassing for prototype.");
    }
  } else {
    isPremiumMember = true;
    worker = {
      id: workerId,
      name: 'Mock Worker ' + workerId,
      cumulativeRating: 4.8,
      servicesOffered: [
        { category: 'Skilled Home Trades', subcategory: 'General Service', payRate: 500, payUnit: 'HOURLY' }
      ]
    };
  }

  if (!worker || worker.servicesOffered.length === 0) {
    notFound();
  }

  const primaryService = worker.servicesOffered[0];
  const subcategories = worker.servicesOffered.map(s => s.subcategory);

  const workerDetails = {
    id: worker.id,
    name: worker.name,
    category: primaryService.category,
    subcategories,
    payRate: primaryService.payRate,
    payUnit: primaryService.payUnit,
    rating: worker.cumulativeRating,
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-[var(--foreground)]">Book Service</h1>
        <p className="opacity-70 text-lg">Configure your booking request.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Configuration */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          {/* Worker Info Card */}
          <GlassCard className="p-6 flex items-center gap-4">
            <img src={`https://i.pravatar.cc/150?u=${worker.id}`} alt={worker.name} className="w-16 h-16 rounded-full border-2 border-[var(--glass-border)] object-cover shadow-sm" />
            <div>
              <h2 className="text-2xl font-bold">{workerDetails.name}</h2>
              <div className="flex items-center gap-2 text-sm opacity-80 mt-1">
                <span>{workerDetails.category}</span>
                <span>•</span>
                <span className="flex items-center text-amber-500 font-bold"><Star size={14} className="mr-1"/> {workerDetails.rating.toFixed(1)}</span>
              </div>
            </div>
          </GlassCard>

          {/* Interactive Form */}
          <BookingForm 
            workerId={worker.id}
            workerDetails={workerDetails}
            isPremiumMember={isPremiumMember}
          />
        </div>
      </div>
    </div>
  );
}
