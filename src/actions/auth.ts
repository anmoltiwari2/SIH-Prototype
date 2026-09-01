'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('mock_user_id')
  cookieStore.delete('mock_phone')
  cookieStore.delete('mock_user_name')
  cookieStore.delete('mock_user_role')

  const supabase = await createClient()
  await supabase.auth.signOut()

  redirect('/login')
}

export async function submitRoleSelection(role: 'CUSTOMER' | 'WORKER') {
  let userId = ''
  let userPhone = ''

  // MOCK BYPASS FOR LOCAL TESTING
  if (process.env.NODE_ENV === 'development') {
    const cookieStore = await cookies()
    const mockUserId = cookieStore.get('mock_user_id')?.value
    const mockPhone = cookieStore.get('mock_phone')?.value
    
    if (mockUserId) {
      userId = mockUserId
      userPhone = mockPhone || 'UNKNOWN'
    }
  }

  // If no mock user, fallback to Supabase
  if (!userId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Rather than throwing an error which causes a Next.js dev overlay,
      // we can gracefully redirect the user to login.
      redirect('/login')
    }
    userId = user.id
    userPhone = user.phone || 'UNKNOWN'
  }

  // Ensure the user exists in our Prisma DB
  let dbUser = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        phone: userPhone,
      }
    })
  }

  // Create the corresponding profile based on the selected role
  if (role === 'CUSTOMER') {
    const existing = await prisma.customerProfile.findUnique({
      where: { userId }
    })
    
    if (!existing) {
      await prisma.customerProfile.create({
        data: {
          userId,
          name: 'New Customer', // Can be updated later
        }
      })
    }
  } else if (role === 'WORKER') {
    const existing = await prisma.workerProfile.findUnique({
      where: { userId }
    })

    if (!existing) {
      await prisma.workerProfile.create({
        data: {
          userId,
          name: 'New Worker', // Can be updated later
        }
      })
    }
  }

  if (role === 'CUSTOMER') {
    redirect('/search')
  } else {
    redirect('/dashboard')
  }
}
