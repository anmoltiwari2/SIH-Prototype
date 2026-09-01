import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AlertTriangle, RadioTower, ArrowRight, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SOSForm } from '@/components/booking/SOSForm';
export default async function SOSPage() {
  let customerId = '';
  const cookieStore = await cookies();
  
  if (process.env.NODE_ENV === 'development') {
    const mockUserId = cookieStore.get('mock_user_id')?.value;
    if (mockUserId) customerId = mockUserId;
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) customerId = user.id;
  }

  if (!customerId) {
    redirect('/login');
  }

    // Server Action to broadcast the bounty
    async function broadcastSOS(formData: FormData) {
      'use server';
      
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;
      const subcategory = formData.get('subcategory') as string;
      const mediaUrl = formData.get('mediaUrl') as string | null;
      
      if (!description || !category || !subcategory) return;

      if (!customerId) {
        throw new Error('Valid Customer ID required');
      }

      let customerProfile = await prisma.customerProfile.findFirst({
        where: { userId: customerId }
      });

      // Fallback for prototype testing: Create a dummy profile if none exists
      if (!customerProfile) {
        customerProfile = await prisma.customerProfile.create({
          data: {
            userId: customerId,
            name: 'Emergency Customer'
          }
        });
      }

      // Create a Booking with workerId: null (Open Bounty) and isEmergency: true (1.5x)
      const baseRate = 800; // Mock base rate for emergencies
      const emergencyRate = baseRate * 1.5;
      
      await prisma.booking.create({
        data: {
          customerId: customerProfile.id,
          workerId: null, // Open Bounty!
          category,
          subcategory,
          mode: 'OFFLINE',
          description: `URGENT SOS: ${description}`,
          mediaUrl,
          scheduledTime: new Date(), // Immediate
          estimatedHours: 1,
          totalAmount: emergencyRate + (emergencyRate * 0.1), // Includes 10% platform fee
          workerPayout: emergencyRate,
          platformFee: emergencyRate * 0.1,
          status: 'PENDING'
        }
      });

      redirect('/dashboard');
    }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-3xl mx-auto flex flex-col items-center justify-center">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 text-red-500 mb-6 relative">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30" />
          <Activity size={48} className="relative z-10" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-red-500">SOS Emergency</h1>
        <p className="opacity-70 text-lg">Broadcast an urgent Open Bounty to all nearby workers. Surge pricing (1.5x) applies automatically.</p>
      </div>

      <GlassCard className="w-full p-8 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
        {/* Subtle pulsing background */}
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
        
        <SOSForm action={broadcastSOS} />
      </GlassCard>

    </div>
  );
}
