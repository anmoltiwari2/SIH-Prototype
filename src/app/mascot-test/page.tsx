'use client'

import React from 'react';
import { useMascot } from '@/lib/MascotContext';
import { CustomerMascotKey, WorkerMascotKey } from '@/lib/mascotConfig';

export default function MascotTestPage() {
  const { 
    isVisible, setIsVisible, 
    userRole, setUserRole, 
    selectedMascot, setSelectedMascot,
    mascotState, setMascotState,
    setMessage
  } = useMascot();

  const customerOptions: CustomerMascotKey[] = ['PLUMBER', 'ELECTRICIAN', 'HOUSEHELP', 'GARDENER', 'TEACHER', 'DOCTOR', 'COOK'];
  const workerOptions: WorkerMascotKey[] = ['HERA_PHERI', 'SRK_SALMAN', 'BARFI', 'MUNNA_CIRCUIT', 'GEET', 'DEEPIKA', 'JAI_VEERU'];

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-[var(--primary)]">Mascot Interactive Sandbox</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Controls */}
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">Global State</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="font-semibold w-24">Visibility:</label>
            <button 
              onClick={() => setIsVisible(!isVisible)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${isVisible ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
              {isVisible ? 'Hide Assistant' : 'Show Assistant'}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="font-semibold w-24">User Role:</label>
            <select 
              value={userRole} 
              onChange={(e) => {
                setUserRole(e.target.value as any);
                setSelectedMascot(null);
              }}
              className="bg-[var(--background)] border border-[var(--glass-border)] rounded-lg p-2"
            >
              <option value="CUSTOMER">Customer (Service Expert)</option>
              <option value="WORKER">Worker (Personality Buddy)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold">Custom Message:</label>
            <textarea 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type what the mascot should say..."
              className="bg-[var(--background)] border border-[var(--glass-border)] rounded-lg p-2 h-24"
            />
          </div>
        </div>

        {/* Mascot & Animation Controls */}
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">Mascot Identity</h2>
          
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-semibold">Select Mascot:</label>
            <div className="flex flex-wrap gap-2">
              {(userRole === 'CUSTOMER' ? customerOptions : workerOptions).map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedMascot(opt)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${selectedMascot === opt ? 'bg-[var(--primary)] text-white border-transparent' : 'bg-[var(--background)] border-[var(--glass-border)] opacity-70 hover:opacity-100'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2 mt-8">Micro-Animations</h2>
          
          <div className="flex flex-wrap gap-2">
            {['idle', 'thinking', 'listening', 'speaking', 'success'].map(state => (
              <button
                key={state}
                onClick={() => setMascotState(state as any)}
                className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${mascotState === state ? 'bg-amber-500 text-white' : 'bg-[var(--background)] border border-[var(--glass-border)] opacity-70 hover:opacity-100'}`}
              >
                {state}
              </button>
            ))}
          </div>
          <p className="text-xs opacity-50 mt-4 italic">
            Note: On desktop, the mascot is in the bottom right corner. On mobile, it's a floating bubble.
          </p>
        </div>
      </div>
    </div>
  );
}
