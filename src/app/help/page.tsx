import { ShieldAlert } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function HelpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="max-w-md p-8 text-center border-red-500/20">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-500/10 text-red-500">
            <ShieldAlert size={48} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-red-500 mb-4">Emergency SOS</h1>
        <p className="text-[var(--foreground)] opacity-80">
          The emergency SOS page is under construction. This will eventually provide immediate access to emergency services and high-priority support.
        </p>
      </GlassCard>
    </div>
  )
}
