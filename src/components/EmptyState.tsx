import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAdd?: () => void;
  entityName?: string;
}

export default function EmptyState({ onAdd, entityName = 'Record' }: EmptyStateProps) {
  return (
    <div id="empty-state" className="flex flex-col items-center justify-center p-12 text-center rounded border border-[#3D4A22] bg-[#1A1F0E] max-w-xl mx-auto my-8 shadow-inner">
      {/* Military Compass Navigator SVG */}
      <div className="h-20 w-20 text-[#8A9070]/60 mb-4 animate-pulse">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="50" cy="50" r="40" strokeDasharray="4, 4" />
          <circle cx="50" cy="50" r="30" />
          
          {/* Compass Needle pointing North */}
          <polygon points="50,15 56,48 50,44" fill="#D32F2F" stroke="#D32F2F" />
          <polygon points="50,85 44,52 50,56" fill="#8A9070" stroke="#8A9070" />
          
          <circle cx="50" cy="50" r="3" fill="#E8DFB8" />
          
          {/* Degree markers */}
          <text x="50" y="11" fill="#C9A84C" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
          <text x="50" y="96" fill="#8A9070" fontSize="8" textAnchor="middle">S</text>
          <text x="88" y="53" fill="#8A9070" fontSize="8" textAnchor="middle">E</text>
          <text x="12" y="53" fill="#8A9070" fontSize="8" textAnchor="middle">W</text>
        </svg>
      </div>

      <h3 className="font-tactical text-xl font-bold uppercase tracking-widest text-[#E8DFB8] mb-1">
        NO RECORDS FOUND
      </h3>
      <p className="font-sans text-xs text-[#8A9070] max-w-xs mb-6">
        The Command Database does not currently register any active {entityName} profiles in this sector.
      </p>

      {onAdd && (
        <button
          id="empty-state-btn-add"
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] font-tactical font-extrabold text-sm uppercase rounded cursor-pointer transition-all active:scale-97 border-b-2 border-[#FF9933] shadow-md shadow-[#1A1F0E]"
        >
          <Plus className="h-4 w-4 text-[#FF9933]" />
          Deploy {entityName}
        </button>
      )}
    </div>
  );
}
