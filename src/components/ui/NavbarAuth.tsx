import React from 'react'
import Link from 'next/link'
import { LogIn, User, LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logout } from '@/actions/auth'

export async function NavbarAuth() {
  const cookieStore = await cookies()
  let userId = cookieStore.get('mock_user_id')?.value
  let userName = cookieStore.get('mock_user_name')?.value

  const isMockUser = !!cookieStore.get('mock_user_id')?.value

  // If no mock user, check Supabase session
  if (!userId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
    }
  }

  // If we have an ID but no name, fetch from the database
  if (userId && !userName) {
    if (isMockUser) {
      userName = 'Test User (Mock)'
    } else {
      try {
        const customer = await prisma.customerProfile.findUnique({ where: { userId } })
        if (customer) {
          userName = customer.name
        } else {
          const worker = await prisma.workerProfile.findUnique({ where: { userId } })
          if (worker) userName = worker.name
        }
      } catch (e) {
        console.warn("Database connection failed in NavbarAuth, falling back to default name.")
        userName = 'User'
      }
    }
  }

  if (userId) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-sm rounded-lg text-sm font-bold text-[var(--foreground)] opacity-90 transition-all hover:opacity-100 hover:shadow-md cursor-default">
          <User size={16} className="text-[var(--primary)]" />
          <span className="hidden sm:inline">Hi, {userName || 'User'}</span>
        </div>
        <form action={logout}>
          <button 
            type="submit"
            className="flex items-center gap-2 text-sm font-semibold opacity-70 hover:opacity-100 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    )
  }

  return (
    <Link 
      href="/login" 
      className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm font-bold rounded-lg shadow-sm hover:shadow-md hover:bg-[var(--primary-hover)] transition-all"
    >
      <LogIn size={16} /> <span className="hidden sm:inline">Login</span>
    </Link>
  )
}
