'use client';

import React from 'react';
import { X, Heart, Star, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { SanctuaryStay } from '../types/sanctuary';

interface SavedStaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSanctuaries: SanctuaryStay[];
  onRemove: (id: string) => void;
  onSelect: (sanctuary: SanctuaryStay) => void;
}

export const SavedStaysModal: React.FC<SavedStaysModalProps> = ({
  isOpen,
  onClose,
  savedSanctuaries,
  onRemove,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-[#111317] border-l border-white/10 p-6 flex flex-col justify-between text-white shadow-2xl">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
              <h2 className="font-editorial text-xl font-medium text-white">
                Saved Curations ({savedSanctuaries.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* List of saved sanctuaries */}
          <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {savedSanctuaries.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Heart className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-sm text-[#8e877c]">
                  Your curation portfolio is empty.
                </p>
                <p className="text-xs text-[#6e685f]">
                  Click the heart icon on any sanctuary to bookmark properties for future escapes.
                </p>
              </div>
            ) : (
              savedSanctuaries.map((stay) => (
                <div
                  key={stay.id}
                  className="group relative p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#d4af37]/40 transition-all flex gap-3 cursor-pointer"
                  onClick={() => {
                    onSelect(stay);
                    onClose();
                  }}
                >
                  <img
                    src={stay.coverImage}
                    alt={stay.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-[#d4af37]">
                      {stay.location.city}, {stay.location.state}
                    </div>
                    <h3 className="font-editorial text-sm font-medium text-white truncate group-hover:text-[#d4af37] transition-colors">
                      {stay.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-[#a8a194]">
                      <span>₹{stay.nightlyPrice.toLocaleString('en-IN')} / night</span>
                      <span>•</span>
                      <div className="flex items-center text-[#d4af37]">
                        <Star className="w-3 h-3 fill-[#d4af37]" />
                        <span className="ml-1 text-[11px]">{stay.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(stay.id);
                    }}
                    title="Remove from saved"
                    className="p-1.5 self-center rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 text-center">
          <div className="text-[11px] text-[#8e877c] flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>All properties certified under our 100-point standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
