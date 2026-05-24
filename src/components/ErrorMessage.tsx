import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export default function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div id="error-message" className="p-6 my-4 rounded border border-[#D32F2F]/30 bg-[#2C3318] max-w-2xl mx-auto shadow-lg text-center">
      <div className="flex items-center justify-center mb-3">
        <ShieldAlert className="h-8 w-8 text-[#D32F2F] animate-bounce" />
      </div>
      <h3 className="font-tactical text-xl font-bold uppercase tracking-wider text-[#E8DFB8] mb-1">
        Communication Blocked / Intel Offline
      </h3>
      <p className="font-sans text-xs text-[#8A9070] mb-4">
        {message || 'Failed to establish sync with HQ server. Please verify database links.'}
      </p>
      {retry && (
        <button
          id="btn-retry-command"
          onClick={retry}
          className="px-4 py-2 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] font-tactical font-bold text-xs uppercase rounded cursor-pointer transition-all active:scale-97 border border-[#C9A84C]/40"
        >
          Re-establish Intel Link
        </button>
      )}
    </div>
  );
}
