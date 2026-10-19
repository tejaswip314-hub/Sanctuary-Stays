'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#08090c] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid: Brand Manifesto & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-white/5">
                <span className="font-editorial text-sm tracking-widest text-[#d4af37]">S</span>
              </div>
              <span className="font-editorial text-lg tracking-[0.25em] uppercase text-white font-semibold">
                Sanctuary
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9e968a] max-w-md leading-relaxed font-light">
              Sanctuary is the sovereign collective of architecturally significant homes across the world. Every stay is audited in-person for acoustic serenity, pure silk and organic cotton bedding, and turnkey departure hospitality.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified 100-Point Vetting Standard • Zero-Chore Policy</span>
            </div>
          </div>

          {/* Private Release Newsletter */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Private Dispatch
            </h4>
            <p className="text-xs text-[#9e968a] leading-relaxed">
              Receive confidential notifications when new architectural icons across the world are accepted into the collective.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to private releases.'); }} className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter private email address..."
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e4c256] text-black font-semibold text-xs tracking-wider uppercase transition-all shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Editorial Press Recognition */}
        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6 text-xs text-[#6e685f]">
          <div className="uppercase tracking-widest text-[10px] text-[#8e877c]">Featured & Reviewed In</div>
          <div className="flex flex-wrap items-center gap-8 font-serif text-sm tracking-widest text-[#8e877c]">
            <span>ARCHITECTURAL DIGEST INDIA</span>
            <span>CONDÉ NAST TRAVELLER</span>
            <span>MINT LOUNGE</span>
            <span>ROBB REPORT INDIA</span>
            <span>ELLE DÉCOR INDIA</span>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6e685f] gap-4">
          <div>
            © 2026 SANCTUARY ARCHITECTURAL COLLECTIVE INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Vetting Protocol</span>
            <span className="hover:text-white cursor-pointer transition-colors">Acoustic Standards</span>
            <span className="hover:text-white cursor-pointer transition-colors">Concierge Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
