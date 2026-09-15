'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { EscrowSummary } from './EscrowSummary';
import { SubscriptionGateModal } from './SubscriptionGateModal';
import { TriageUpload } from './TriageUpload';
import { createBooking } from '@/actions/booking';
import { useMascot } from '@/lib/MascotContext';
import { CustomerMascotKey } from '@/lib/mascotConfig';

interface BookingFormProps {
  workerId: string;
  workerDetails: {
    name: string;
    category: string;
    subcategories: string[];
    payRate: number;
    payUnit: string;
  };
  isPremiumMember: boolean;
}

export function BookingForm({ workerId, workerDetails, isPremiumMember }: BookingFormProps) {
  const [mode, setMode] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');
  const [subcategory, setSubcategory] = useState(workerDetails.subcategories[0] || '');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [showSurgeBidding, setShowSurgeBidding] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiState, setAiState] = useState<'IDLE' | 'ANALYZING_1' | 'ANALYZING_2' | 'DONE'>('IDLE');

  const { setUserRole, setSelectedMascot, setIsVisible } = useMascot();

  React.useEffect(() => {
    setUserRole('CUSTOMER');
    setIsVisible(true);
    
    let assignedMascot: CustomerMascotKey = 'PLUMBER';
    const cat = workerDetails.category;
    if (cat === 'Cook') assignedMascot = 'COOK';
    else if (cat === 'Study/Tutoring') assignedMascot = 'TEACHER';
    else if (cat === 'Cleaning') assignedMascot = 'HOUSEHELP';
    else if (cat === 'Skilled Home Trades') assignedMascot = 'PLUMBER';
    else if (cat === 'Mechanical') assignedMascot = 'DOCTOR';
    
    setSelectedMascot(assignedMascot);
  }, [workerDetails.category, setUserRole, setSelectedMascot, setIsVisible]);

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    try {
      await createBooking({
        workerId,
        category: workerDetails.category,
        subcategory,
        mode,
        isEmergency: surgeMultiplier > 1.0,
        estimatedHours,
        description: `Contact Phone: ${contactPhone}\n\n${description}`,
        mediaUrl
      });
      // The action will automatically redirect to /dashboard
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create booking.');
      setLoading(false);
    }
  };

  const [showGate, setShowGate] = useState(false);

  const attemptBook = () => {
    if (!isPremiumMember) {
      setShowGate(true);
    } else {
      handleBook();
    }
  };

  const handleAIAnalyze = async () => {
    if (!description.trim()) return;
    
    setAiState('ANALYZING_1');
    await new Promise(r => setTimeout(r, 1200));
    setAiState('ANALYZING_2');
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate AI setting the form values based on the text
    const lowerDesc = description.toLowerCase();
    
    // Simple heuristic for demo
    if (lowerDesc.includes('urgent') || lowerDesc.includes('burst') || lowerDesc.includes('now') || lowerDesc.includes('leak')) {
      setShowSurgeBidding(true);
      setSurgeMultiplier(1.5);
    } else {
      setShowSurgeBidding(false);
      setSurgeMultiplier(1.0);
    }

    if (lowerDesc.includes('fan') || lowerDesc.includes('light')) {
      if (workerDetails.subcategories.includes('Electrical Repair')) setSubcategory('Electrical Repair');
      setEstimatedHours(1.5);
    } else if (lowerDesc.includes('clean')) {
      if (workerDetails.subcategories.includes('Deep Cleaning')) setSubcategory('Deep Cleaning');
      setEstimatedHours(4);
    } else if (lowerDesc.includes('pipe') || lowerDesc.includes('leak')) {
      if (workerDetails.subcategories.includes('Emergency Plumbing SOS')) setSubcategory('Emergency Plumbing SOS');
      setEstimatedHours(2);
    } else {
      setEstimatedHours(2);
    }
    
    setAiState('DONE');
  };

  const getProbability = (multiplier: number) => {
    if (multiplier <= 1.0) return 0;
    if (multiplier <= 1.2) return 25;
    if (multiplier <= 1.5) return 60;
    if (multiplier <= 2.0) return 85;
    return 98;
  };

  const probability = getProbability(surgeMultiplier);

  const emergencyMultiplier = surgeMultiplier;
  const unitMultiplier = workerDetails.payUnit === 'HOURLY' ? estimatedHours : 1.0;
  const workerPayout = workerDetails.payRate * unitMultiplier * emergencyMultiplier;
  const platformFee = workerPayout * 0.08;

  return (
    <>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-semibold w-full">
          {error}
        </div>
      )}

      {showGate && (
        <SubscriptionGateModal 
          platformFee={platformFee}
          onClose={() => setShowGate(false)}
          onContinueWithFee={handleBook}
        />
      )}

      {/* Left Column: Form */}
      <div className="w-full lg:w-2/3 space-y-6">
        <GlassCard className="p-6 space-y-6 relative overflow-hidden">
          
          {/* AI Fair-Price Estimator Section */}
          <div className="relative z-10 border border-cyan-500/30 bg-black/40 rounded-xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.1)] mb-8 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
               <Sparkles className="text-cyan-400" size={18} /> AI Smart-Quote
            </h3>
            <p className="text-xs opacity-70 mb-4">Describe what needs to be done. Our cooperative AI will analyze the task and suggest a fair-market price to prevent overcharging.</p>
            
            <textarea 
              rows={3}
              className="w-full bg-white/5 border border-cyan-500/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-white transition-all placeholder:opacity-50"
              placeholder="e.g. My ceiling fan is making a loud grinding noise and wobbling..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (aiState === 'DONE') setAiState('IDLE');
              }}
            />
            
            <div className="mt-4 flex flex-col items-center">
              {aiState === 'IDLE' && (
                <button 
                  onClick={handleAIAnalyze}
                  disabled={!description.trim()}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center gap-2"
                >
                  Analyze with AI <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              
              {(aiState === 'ANALYZING_1' || aiState === 'ANALYZING_2') && (
                <div className="w-full py-4 flex flex-col items-center justify-center text-cyan-400">
                  <Loader2 className="animate-spin mb-2" size={24} />
                  <motion.p 
                    key={aiState}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold tracking-widest uppercase"
                  >
                    {aiState === 'ANALYZING_1' ? 'Scanning issue patterns...' : 'Cross-referencing cooperative pricing...'}
                  </motion.p>
                </div>
              )}
              
              {aiState === 'DONE' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full mt-2 bg-gradient-to-br from-cyan-900/40 to-purple-900/40 border border-cyan-500/50 rounded-lg p-4 flex justify-between items-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                  <div>
                    <p className="text-xs text-cyan-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> AI Analysis Complete</p>
                    <p className="text-sm opacity-90">Auto-filled: <span className="font-bold text-white">{estimatedHours} hrs</span> • <span className="font-bold text-white">{subcategory}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70 mb-0.5">Fair Market Estimate</p>
                    <p className="text-2xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                      ₹{(workerDetails.payRate * estimatedHours).toFixed(0)}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent my-6" />

          {/* Mode & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Service Mode</label>
              <div className="flex bg-[var(--foreground)]/5 rounded-md p-1 border border-[var(--glass-border)]">
                {['OFFLINE', 'ONLINE'].map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m as any)}
                    className={`flex-1 text-sm font-bold py-2 rounded-sm transition-colors ${mode === m ? 'bg-[var(--primary)] text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-[var(--foreground)]/5'}`}
                  >
                    {m === 'OFFLINE' ? 'In-Person' : 'Virtual'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Urgency</label>
              <div className="flex bg-[var(--foreground)]/5 rounded-md p-1 border border-[var(--glass-border)] transition-colors">
                <button
                  onClick={() => { setShowSurgeBidding(false); setSurgeMultiplier(1.0); }}
                  className={`flex-1 text-sm font-bold py-2 rounded-sm transition-colors ${!showSurgeBidding ? 'bg-[var(--primary)] text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-[var(--foreground)]/5'}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setShowSurgeBidding(true)}
                  className={`flex-1 text-sm font-bold py-2 rounded-sm transition-colors ${showSurgeBidding ? 'bg-red-500 text-white shadow-sm' : 'text-red-500 opacity-70 hover:opacity-100 hover:bg-[var(--foreground)]/5'}`}
                >
                  Emergency SOS
                </button>
              </div>
            </div>
          </div>

          {/* AI Dynamic Surge Bidding Engine */}
          <AnimatePresence>
            {showSurgeBidding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-5 rounded-xl border border-red-500/30 bg-red-500/10 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-red-500 flex items-center gap-2">
                      <Sparkles size={16} /> AI Surge Bidding
                    </h4>
                    <span className="text-xs font-bold px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                      High Demand Detected
                    </span>
                  </div>
                  
                  <p className="text-sm opacity-80 mb-6">
                    Workers are currently busy. Drag the slider to add a surge bonus and increase your chances of instant SOS acceptance.
                  </p>

                  <div className="mb-8 px-2">
                    <input 
                      type="range" 
                      min="1.0" 
                      max="2.5" 
                      step="0.1" 
                      value={surgeMultiplier}
                      onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <div className="flex justify-between mt-2 text-xs font-bold opacity-50">
                      <span>1.0x</span>
                      <span>1.5x</span>
                      <span>2.0x</span>
                      <span>2.5x</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/10">
                    <div>
                      <p className="text-xs font-bold opacity-70 uppercase">Surge Multiplier</p>
                      <p className="text-2xl font-black text-white">{surgeMultiplier.toFixed(1)}x</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold opacity-70 uppercase mb-1">Acceptance Probability</p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${probability > 80 ? 'bg-emerald-500' : probability > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${probability}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${probability > 80 ? 'text-emerald-500' : probability > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                          {probability}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Specific Task</label>
            <select 
              className="w-full bg-transparent border border-[var(--glass-border)] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] [&>option]:text-black transition-colors"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              {Array.from(new Set(workerDetails.subcategories)).map(sub => (
                <option key={sub as string} value={sub as string}>{sub as string}</option>
              ))}
            </select>
          </div>

          {/* Estimated Hours */}
          {workerDetails.payUnit === 'HOURLY' && (
            <div>
              <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider flex justify-between">
                <span>Estimated Hours</span>
                <span className="text-[var(--primary)]">{estimatedHours} hr</span>
              </label>
              <input 
                type="range" min="1" max="12" step="0.5" 
                value={estimatedHours} 
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
                className="w-full accent-[var(--primary)] transition-all"
              />
            </div>
          )}

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Contact Phone Number</label>
            <input 
              type="tel"
              className="w-full bg-transparent border border-[var(--glass-border)] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="e.g. 9876543210"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>

          {/* Virtual Triage */}
          <TriageUpload onUploadSuccess={(url) => setMediaUrl(url)} />

        </GlassCard>
      </div>

      {/* Right Column: Escrow Calculator */}
      <div className="w-full lg:w-1/3">
        <EscrowSummary 
          baseRate={workerDetails.payRate}
          rateUnit={workerDetails.payUnit}
          estimatedHours={estimatedHours}
          surgeMultiplier={surgeMultiplier}
          isPremiumMember={isPremiumMember}
          onBook={attemptBook}
          loading={loading}
        />
      </div>
    </>
  );
}
