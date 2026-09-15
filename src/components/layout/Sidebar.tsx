'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, LayoutDashboard, AlertTriangle, Menu, X, Sparkles, Crown, Building2, GraduationCap, ChevronDown, ChevronRight, Briefcase, Coins } from 'lucide-react'

const navItems = [
  { name: 'Home', path: '/', icon: Home, color: 'text-blue-400' },
  { name: 'Find Workers', path: '/search', icon: Search, color: 'text-emerald-400' },
  { name: 'Gully Premium', path: '/premium', icon: Crown, color: 'text-amber-400', glow: true },
  { name: 'Enterprise B2B', path: '/enterprise', icon: Building2, color: 'text-indigo-400' },
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    color: 'text-purple-400',
    subItems: [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Skill Academy', path: '/dashboard/academy', icon: GraduationCap },
      { name: 'My Gigs', path: '/dashboard/gigs', icon: Briefcase },
      { name: 'GullyCredit', path: '/dashboard/credit', icon: Coins },
    ]
  },
  { name: 'SOS Bounties', path: '/bounties', icon: AlertTriangle, color: 'text-red-500', glow: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    '/dashboard': pathname.startsWith('/dashboard')
  })

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname === path || (path !== '/' && pathname === path)
  }

  const isParentActive = (item: any) => {
    if (isActive(item.path)) return true
    if (item.subItems) {
      return item.subItems.some((sub: any) => isActive(sub.path))
    }
    return false
  }

  const toggleMenu = (path: string, e: React.MouseEvent) => {
    e.preventDefault()
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }))
  }

  // Sidebar content (shared between desktop fixed and mobile drawer)
  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full bg-black/80 backdrop-blur-2xl border-r border-white/10 relative overflow-hidden">
      
      {/* Liquid Gooey background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen" style={{ filter: 'url(#goo)' }}>
         <motion.div 
           animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
           className="absolute top-10 -left-10 w-32 h-32 bg-purple-600/30 rounded-full blur-2xl" 
         />
         <motion.div 
           animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
           className="absolute bottom-40 -right-10 w-40 h-40 bg-cyan-600/30 rounded-full blur-2xl" 
         />
      </div>

      <div className="p-6 pb-2 border-b border-white/5 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all">
            <img src="/logo.jpg" alt="GullyGigs Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black">G</div>' }} />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            GullyGigs
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2 relative z-10">
        {navItems.map((item) => {
          const parentActive = isParentActive(item)
          const isExpanded = expandedMenus[item.path]
          const Icon = item.icon
          
          return (
            <div key={item.path} className="flex flex-col">
              <Link 
                href={item.subItems ? '#' : item.path}
                onClick={(e) => {
                  if (item.subItems) {
                    toggleMenu(item.path, e)
                  } else {
                    setIsOpen(false)
                  }
                }}
                className="relative"
              >
                <div className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${parentActive 
                    ? 'bg-white/10 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                    : 'hover:bg-white/5 border border-transparent'}
                  ${item.glow && parentActive ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}
                `}>
                  <Icon size={20} className={`${parentActive ? item.color : 'text-white/50 group-hover:text-white/80'} transition-colors`} />
                  <span className={`flex-1 font-semibold ${parentActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                    {item.name}
                  </span>
                  
                  {item.subItems && (
                    <div className="opacity-50">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  )}

                  {/* Active Indicator Dot (only for items without subItems to avoid clutter) */}
                  {parentActive && !item.subItems && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className={`absolute right-4 w-1.5 h-1.5 rounded-full ${item.glow ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]' : 'bg-[var(--primary)] shadow-[0_0_10px_rgba(var(--primary-rgb),1)]'}`} 
                    />
                  )}
                </div>
              </Link>

              {/* Sub Items */}
              {item.subItems && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden ml-6 pl-4 border-l border-white/10 mt-2 flex flex-col gap-1"
                    >
                      {item.subItems.map(subItem => {
                        const subActive = isActive(subItem.path)
                        const SubIcon = subItem.icon
                        return (
                          <Link 
                            key={subItem.path} 
                            href={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${subActive ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}
                          >
                            <SubIcon size={16} className={subActive ? item.color : 'opacity-50'} />
                            <span className="text-sm font-semibold">{subItem.name}</span>
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-6 relative z-10">
        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/30 blur-2xl group-hover:bg-purple-400/50 transition-colors" />
          <Sparkles size={16} className="text-purple-400 mb-2" />
          <p className="text-xs font-bold text-white mb-1">Go Premium</p>
          <p className="text-[10px] text-white/60 mb-3">0% platform fees on bookings</p>
          <Link href="/premium" className="block text-center w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 shrink-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-3 left-4 z-[60]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-white shadow-lg flex items-center justify-center"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 h-screen w-[280px] z-[55] shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
