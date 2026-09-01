'use client'

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UploadCloud, FileVideo, FileImage, X, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface TriageUploadProps {
  onUploadSuccess: (url: string) => void;
}

export function TriageUpload({ onUploadSuccess }: TriageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      // MOCK UPLOAD FOR PROTOTYPE
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fileExt = file.name.split('.').pop();
      const mockUrl = `https://mock-storage.gullygigs.com/triage-uploads/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      onUploadSuccess(mockUrl);
      setUploading(false);
      setFile(null); // Clear on success
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error uploading file.');
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-semibold mb-2 opacity-80 uppercase tracking-wider">Virtual Triage (Optional)</label>
      <p className="text-xs opacity-60 mb-3">Upload a short video or photo of the issue so the worker can arrive prepared.</p>

      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--glass-border)] rounded-xl cursor-pointer bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-[var(--primary)] opacity-80">
            <UploadCloud size={32} className="mb-2" />
            <p className="text-sm font-semibold">Click to upload media</p>
            <p className="text-xs opacity-70">MP4, JPG, PNG (Max 10MB)</p>
          </div>
          <input type="file" className="hidden" accept="video/mp4,image/jpeg,image/png" onChange={handleFileChange} />
        </label>
      ) : (
        <GlassCard className="p-4 flex items-center justify-between border-[var(--primary)]/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
              {file.type.startsWith('video') ? <FileVideo size={24} /> : <FileImage size={24} />}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold truncate">{file.name}</p>
              <p className="text-xs opacity-70">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!uploading && (
              <button onClick={() => setFile(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                <X size={18} />
              </button>
            )}
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-bold rounded-md disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : 'Upload'}
            </button>
          </div>
        </GlassCard>
      )}
      
      {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
}
