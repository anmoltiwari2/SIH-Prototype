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

  const cookieStore = await cookies()
  const mockUserId = cookieStore.get('mock_user_id')?.value
  const mockPhone = cookieStore.get('mock_phone')?.value
  const isMockUser = !!mockUserId
  
  if (mockUserId) {
    userId = mockUserId
    userPhone = mockPhone || 'UNKNOWN'
  }

  // If no mock user, fallback to Supabase
  if (!userId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }
    userId = user.id
    userPhone = user.phone || 'UNKNOWN'
  }

  if (!isMockUser) {
    try {
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
    } catch (e) {
      console.warn("Database connection failed in submitRoleSelection, bypassing for prototype.")
    }
  }

  if (role === 'CUSTOMER') {
    redirect('/search')
  } else {
    redirect('/dashboard')
  }
}
