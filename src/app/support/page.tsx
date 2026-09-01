import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function SupportPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#F5F5DC] dark:bg-[var(--background)]">
      <GlassCard className="max-w-2xl w-full p-10 text-center">
        <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-4">GullyGigs Support</h1>
        <p className="text-lg opacity-80">
          Welcome to the help center. If you have any issues with bookings, escrow payments, or verification, please contact our support team.
        </p>
      </GlassCard>
    </div>
  );
}
