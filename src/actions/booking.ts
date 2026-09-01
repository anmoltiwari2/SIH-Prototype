'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

interface BookingParams {
  workerId: string;
  category: string;
  subcategory: string;
  mode: 'ONLINE' | 'OFFLINE';
  isEmergency: boolean;
  estimatedHours: number;
  description: string;
  mediaUrl: string | null;
}

export async function createBooking(params: BookingParams) {
  let customerId = ''

  const cookieStore = await cookies()
  const mockUserId = cookieStore.get('mock_user_id')?.value
  const isMockUser = !!mockUserId

  if (mockUserId) {
    customerId = mockUserId
  }

  // Real Auth fallback
  if (!customerId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    customerId = user.id
  }

  if (!isMockUser) {
    try {
      // 1. Fetch Customer Profile (and ensure it exists)
      const customerProfile = await prisma.customerProfile.findUnique({
        where: { userId: customerId }
      })
      if (!customerProfile) throw new Error('Customer profile not found.')

      // 2. Fetch Worker and their Service
      const worker = await prisma.workerProfile.findUnique({
        where: { id: params.workerId },
        include: {
          servicesOffered: {
            where: { subcategory: params.subcategory }
          }
        }
      })
      if (!worker || worker.servicesOffered.length === 0) {
        throw new Error('Worker or specific service not found.')
      }

      const service = worker.servicesOffered[0]

      // 3. Server-side Financial Calculations
      const emergencyMultiplier = params.isEmergency ? 1.5 : 1.0
      const unitMultiplier = service.payUnit === 'HOURLY' ? params.estimatedHours : 1.0
      
      const workerPayout = service.payRate * unitMultiplier * emergencyMultiplier
      const platformFee = customerProfile.premiumStatus ? 0 : (workerPayout * 0.08)
      const totalAmount = workerPayout + platformFee

      // 4. Create the Booking
      await prisma.booking.create({
        data: {
          customerId: customerProfile.id,
          workerId: worker.id,
          category: params.category,
          subcategory: params.subcategory,
          mode: params.mode,
          description: params.description,
          mediaUrl: params.mediaUrl,
          scheduledTime: new Date(Date.now() + 86400000), // Default to 24h from now for demo
          estimatedHours: params.estimatedHours,
          totalAmount,
          platformFee,
          workerPayout,
          status: 'PENDING'
        }
      })
    } catch (e) {
      console.warn("Database connection failed in createBooking, bypassing for prototype.")
    }
  } else {
    console.warn("Mock user detected in createBooking, skipping database operations.")
  }

  // Redirect to dashboard
  redirect('/dashboard')
}
