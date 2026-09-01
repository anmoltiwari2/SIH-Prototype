'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function submitProfileSetup(data: { 
  role: 'CUSTOMER' | 'WORKER', 
  name: string, 
  age: string, 
  gender: string,
  category?: string,
  subcategory?: string
}) {
  let userId = ''
  
  const cookieStore = await cookies()
  const mockUserId = cookieStore.get('mock_user_id')?.value
  const isMockUser = !!mockUserId

  if (mockUserId) {
    userId = mockUserId
  }

  if (!userId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    userId = user.id
  }

  cookieStore.set('mock_user_name', data.name, { path: '/', maxAge: 86400 * 30 })
  cookieStore.set('mock_user_role', data.role, { path: '/', maxAge: 86400 * 30 })

  if (!isMockUser) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          age: parseInt(data.age) || null,
          gender: data.gender || null,
        }
      })

      if (data.role === 'CUSTOMER') {
        await prisma.customerProfile.upsert({
          where: { userId: userId },
          update: { name: data.name },
          create: { userId: userId, name: data.name }
        })
      } else if (data.role === 'WORKER') {
        const worker = await prisma.workerProfile.upsert({
          where: { userId: userId },
          update: { name: data.name },
          create: { userId: userId, name: data.name }
        })

        if (data.category && data.subcategory) {
          await prisma.workerService.create({
            data: {
              workerId: worker.id,
              category: data.category,
              subcategory: data.subcategory,
              payRate: 500,
              payUnit: 'HOURLY',
              supportsOnline: false,
              supportsOffline: true
            }
          })
        }
      }
    } catch (e) {
      console.warn("Database connection failed in submitProfileSetup, bypassing for prototype.")
    }
  }

  redirect('/dashboard')
}

export async function upgradeToPlus() {
  let userId = ''
  
  const cookieStore = await cookies()
  const mockUserId = cookieStore.get('mock_user_id')?.value
  
  if (mockUserId) {
    userId = mockUserId
  }

  if (!userId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    userId = user.id
  }

  if (mockUserId) {
    console.warn("Mock user detected in upgradeToPlus, skipping database update.")
    return
  }

  try {
    await prisma.customerProfile.update({
      where: { userId },
      data: { premiumStatus: true }
    })
  } catch (e) {
    console.warn("Database connection failed in upgradeToPlus, bypassing for prototype.")
  }
}
