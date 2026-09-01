'use client'

import React, { useState } from 'react';
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
  const [isEmergency, setIsEmergency] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        isEmergency,
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

  const emergencyMultiplier = isEmergency ? 1.5 : 1.0;
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
        <GlassCard className="p-6 space-y-6">
          
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
              <div className="flex bg-[var(--foreground)]/5 rounded-md p-1 border border-[var(--glass-border)]">
                <button
                  onClick={() => setIsEmergency(false)}
                  className={`flex-1 text-sm font-bold py-2 rounded-sm transition-colors ${!isEmergency ? 'bg-[var(--primary)] text-white shadow-sm' : 'opacity-70 hover:opacity-100 hover:bg-[var(--foreground)]/5'}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setIsEmergency(true)}
                  className={`flex-1 text-sm font-bold py-2 rounded-sm transition-colors ${isEmergency ? 'bg-red-500 text-white shadow-sm' : 'text-red-500 opacity-70 hover:opacity-100 hover:bg-[var(--foreground)]/5'}`}
                >
                  Emergency (1.5x)
                </button>
              </div>
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Specific Task</label>
            <select 
              className="w-full bg-transparent border border-[var(--glass-border)] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] [&>option]:text-black"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              {Array.from(new Set(workerDetails.subcategories)).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Estimated Hours */}
          {workerDetails.payUnit === 'HOURLY' && (
            <div>
              <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Estimated Hours: {estimatedHours} hr</label>
              <input 
                type="range" min="1" max="12" step="0.5" 
                value={estimatedHours} 
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          )}

          {/* Contact Phone & Description */}
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Issue Description</label>
              <textarea 
                rows={4}
                className="w-full bg-transparent border border-[var(--glass-border)] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                placeholder="Describe what needs to be done..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
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
          isEmergency={isEmergency}
          isPremiumMember={isPremiumMember}
          onBook={attemptBook}
          loading={loading}
        />
      </div>
    </>
  );
}
