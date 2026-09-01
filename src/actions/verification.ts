'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyDigiLocker() {
  let userId = ''

  if (process.env.NODE_ENV === 'development') {
    const cookieStore = await cookies()
    const mockUserId = cookieStore.get('mock_user_id')?.value
    if (mockUserId) {
      userId = mockUserId
    }
  }

  const cookieStore = await cookies()
  const phone = process.env.NODE_ENV === 'development' ? cookieStore.get('mock_phone')?.value || '+919999999999' : ''

  if (!userId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    userId = user.id
  }

  // Update or Create user verification tier in the database
  const isMockUser = !!cookieStore.get('mock_user_id')?.value

  if (!isMockUser) {
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          verificationTier: 'ID_VERIFIED',
          digiLockerId: `DL-MOCK-${Math.floor(Math.random() * 1000000)}`
        },
        create: {
          id: userId,
          phone: phone || `+91${Math.floor(Math.random() * 10000000000)}`,
          verificationTier: 'ID_VERIFIED',
          digiLockerId: `DL-MOCK-${Math.floor(Math.random() * 1000000)}`
        }
      })
    } catch (e) {
      console.warn("Database connection failed in verifyDigiLocker, bypassing for prototype.")
    }
  } else {
    console.warn("Mock user detected in verifyDigiLocker, skipping database upsert.")
  }

  redirect('/setup-profile')
}
