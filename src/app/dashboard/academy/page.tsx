'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Award, BookOpen, Clock, PlayCircle, Loader2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useRouter } from 'next/navigation'

export default function AcademyPage() {
  const router = useRouter()
  const [enrolling, setEnrolling] = useState<string | null>(null)

  const handleEnroll = (courseId: string) => {
    setEnrolling(courseId)
    setTimeout(() => {
      setEnrolling(null)
      alert("Successfully enrolled! Course material sent to your email.")
    }, 1500)
  }

  const courses = [
    {
      id: 'c1',
      title: 'Advanced Split AC Repair',
      category: 'HVAC',
      duration: '4 Hours',
      level: 'Advanced',
      price: '₹999',
      multiplier: '+20% Higher Rates',
      image: 'bg-blue-500/20',
      icon: <Award className="text-blue-400" />
    },
    {
      id: 'c2',
      title: 'Corporate Deep Cleaning Protocol',
      category: 'Cleaning',
      duration: '2 Hours',
      level: 'Intermediate',
      price: '₹499',
      multiplier: 'Unlocks B2B Gigs',
      image: 'bg-emerald-500/20',
      icon: <Award className="text-emerald-400" />
    },
    {
      id: 'c3',
      title: 'Smart Home Automation Installation',
      category: 'Electrical',
      duration: '6 Hours',
      level: 'Expert',
      price: '₹1499',
      multiplier: '+35% Higher Rates',
      image: 'bg-purple-500/20',
      icon: <Award className="text-purple-400" />
    }
  ]

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 font-bold rounded-full mb-4">
            <GraduationCap size={20} /> Skill Academy
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Level up your career.
          </h1>
          <p className="text-lg opacity-70 max-w-2xl">
            Purchase certification courses from partnered trade schools. Passing these exams upgrades your profile Tier and allows you to charge higher rates!
          </p>
        </div>
        
        <GlassCard className="p-4 flex items-center gap-4 border-pink-500/30">
          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400">
            <BookOpen />
          </div>
          <div>
            <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Your Certifications</p>
            <p className="text-xl font-bold">0 Active</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden flex flex-col h-full border-white/10 hover:border-pink-500/50 transition-colors group">
              {/* Course Thumbnail */}
              <div className={`h-40 w-full ${course.image} relative flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <PlayCircle size={48} className="text-white/50 group-hover:scale-110 group-hover:text-white transition-all z-10" />
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold border border-white/10">
                  {course.category}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                
                <div className="flex items-center gap-4 text-xs font-bold opacity-70 mb-4">
                  <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                  <span className="flex items-center gap-1">{course.icon} {course.level}</span>
                </div>

                <div className="mt-auto p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg mb-6 flex items-start gap-3">
                  <Award className="text-pink-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-pink-400">PERK UNLOCKED</p>
                    <p className="text-sm font-semibold">{course.multiplier}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold">{course.price}</span>
                  <button 
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling === course.id}
                    className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-lg font-bold transition-all shadow-lg flex items-center gap-2"
                  >
                    {enrolling === course.id ? <><Loader2 size={16} className="animate-spin" /> Enrolling</> : 'Enroll Now'}
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
