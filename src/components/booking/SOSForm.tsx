'use client'

import React, { useState } from 'react';
import { AlertTriangle, RadioTower, Loader2 } from 'lucide-react';
import { TriageUpload } from './TriageUpload';

export function SOSForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (mediaUrl) formData.append('mediaUrl', mediaUrl);
    
    try {
      await action(formData);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">Emergency Type</label>
          <select name="category" required className="w-full bg-[var(--foreground)]/5 border border-red-500/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none font-semibold">
            <option value="Skilled Home Trades" className="text-black dark:text-white bg-white dark:bg-zinc-800">Skilled Home Trades</option>
            <option value="Mechanical" className="text-black dark:text-white bg-white dark:bg-zinc-800">Mechanical/Automotive</option>
            <option value="Cleaning" className="text-black dark:text-white bg-white dark:bg-zinc-800">Biohazard / Urgent Cleaning</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">Specific Issue</label>
          <input type="text" name="subcategory" placeholder="e.g. Burst Pipe, Broken Lock" required className="w-full bg-[var(--foreground)]/5 border border-red-500/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">Describe the situation</label>
        <textarea name="description" rows={4} placeholder="Please provide details so workers can arrive prepared..." required className="w-full bg-[var(--foreground)]/5 border border-red-500/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
      </div>

      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
         <TriageUpload onUploadSuccess={(url) => setMediaUrl(url)} />
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-red-500 text-sm">Open Bounty Dispatch</h4>
          <p className="text-xs opacity-80 mt-1">By pressing broadcast, you skip worker selection. The first available verified worker in your area will claim this job. A 1.5x urgency multiplier is added to the base rate.</p>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin" /> : <><RadioTower size={24} className="group-hover:animate-bounce" /> Broadcast to Community</>}
      </button>
    </form>
  );
}
