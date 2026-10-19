'use client';

import React from 'react';
import { ShieldCheck, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-14 pb-20 overflow-hidden border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none animate-breathe" />
      <div className="absolute top-0 right-10 w-[400px] h-[300px] bg-[#5e4b3c]/10 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-drift absolute -top-24 left-[15%] h-[220px] w-[1px] bg-gradient-to-b from-transparent via-[#d4af37]/25 to-transparent" />
        <div className="animate-drift absolute -top-24 left-[55%] h-[320px] w-[1px] bg-gradient-to-b from-transparent via-[#d4af37]/15 to-transparent" style={{ animationDelay: '2.5s' }} />
        <div className="animate-drift absolute -top-24 right-[12%] h-[260px] w-[1px] bg-gradient-to-b from-transparent via-[#d4af37]/20 to-transparent" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Curated Brand Tag (Refined for India without mentioning Airbnb) */}
        <div className="animate-fade-up inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse-soft" />
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#d4af37]">
            The Curated Architecture &amp; Heritage Stays of the World
          </span>
        </div>

        {/* Subtitle */}
        <p className="animate-fade-up [animation-delay:120ms] text-base sm:text-lg text-[#b8b0a2] max-w-2xl mx-auto font-light leading-relaxed">
          From sandstone bastions in Rajasthan to Himalayan solar sanctuaries in Ladakh. Every home is inspected in person, acoustically audited, and serviced with white-glove hospitality standards.
        </p>

        {/* The 4 Refinement Pillars */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="animate-fade-up [animation-delay:200ms] p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-[#d4af37]/30 hover:-translate-y-1 hover:bg-[#d4af37]/[0.06] transition-all duration-300">
            <div className="flex items-center space-x-2 text-[#d4af37] mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold tracking-wider">Top 1.8% Worldwide</span>
            </div>
            <p className="text-xs text-[#9d9588]">Strictly vetted by our architectural and heritage jury.</p>
          </div>

          <div className="animate-fade-up [animation-delay:300ms] p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-[#d4af37]/30 hover:-translate-y-1 hover:bg-[#d4af37]/[0.06] transition-all duration-300">
            <div className="flex items-center space-x-2 text-[#d4af37] mb-1.5">
              <VolumeX className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold tracking-wider">Acoustic Audits</span>
            </div>
            <p className="text-xs text-[#9d9588]">Verified under 22 dB. Pure Himalayan and desert stillness.</p>
          </div>

          <div className="animate-fade-up [animation-delay:400ms] p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-[#d4af37]/30 hover:-translate-y-1 hover:bg-[#d4af37]/[0.06] transition-all duration-300">
            <div className="flex items-center space-x-2 text-[#d4af37] mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold tracking-wider">Zero Chore Exit</span>
            </div>
            <p className="text-xs text-[#9d9588]">Never clean or strip linens. Pure turnkey white-glove departure.</p>
          </div>

          <div className="animate-fade-up [animation-delay:500ms] p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-[#d4af37]/30 hover:-translate-y-1 hover:bg-[#d4af37]/[0.06] transition-all duration-300">
            <div className="flex items-center space-x-2 text-[#d4af37] mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold tracking-wider">Royal Concierge</span>
            </div>
            <p className="text-xs text-[#9d9588]">Private maharaj chefs, solar boat cruises, and helicopter transfers.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
