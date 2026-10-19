'use client';

import React from 'react';
import { ShieldCheck, VolumeX, Sparkles, Check, X, Coffee, HeartHandshake } from 'lucide-react';

export const VettingStandardSection: React.FC = () => {
  const comparisonItems = [
    {
      feature: 'Departure & Checkout',
      standardRental: 'Cumbersome chore lists: stripping bedsheets, taking out waste, washing dishes',
      sanctuary: 'Zero chores guaranteed. Step out effortlessly. Turnkey butler housekeeping.',
    },
    {
      feature: 'Acoustics & Sound Serenity',
      standardRental: 'Traffic noise, honking, thin shared walls, and ambient disturbance',
      sanctuary: 'In-person calibrated decibel audit. Stays certified under 22 dB whisper-quiet.',
    },
    {
      feature: 'Bedding & Textiles',
      standardRental: 'Synthetic polyester blends, generic cotton, and inconsistent mattresses',
      sanctuary: 'Pure mulberry silk, 600-thread organic Indian cotton, and natural latex.',
    },
    {
      feature: 'Jury Acceptance Rate',
      standardRental: 'Over 90% mass acceptance rate; listing clutter and misleading photos',
      sanctuary: 'Only the top 1.8% of architect-designed homes worldwide pass jury inspection.',
    },
    {
      feature: 'Concierge & Human Care',
      standardRental: 'Automated chatbots and absentee hosts',
      sanctuary: 'Dedicated in-villa private liaison for Royal Maharaj chefs, boats, and transfers.',
    },
  ];

  return (
    <section id="the-standard" className="py-24 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#d4af37]">
              The Global Benchmark
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-medium tracking-tight">
            The 100-Point Sanctuary Standard: <br />
            <span className="font-serif italic font-light text-[#dfd0bd]">An Antidote to Mass Vacation Rentals</span>
          </h2>
          <p className="text-sm sm:text-base text-[#a8a194] leading-relaxed font-light">
            We built Sanctuary because extraordinary architectural luxury should never culminate in departure chores or unpredictable, mass-market accommodations.
          </p>
        </div>

        {/* Head-to-Head Comparison Table */}
        <div className="rounded-3xl border border-white/10 bg-[#121419] overflow-hidden shadow-2xl max-w-5xl mx-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 border-b border-white/10 text-xs tracking-wider uppercase font-semibold">
            <div className="col-span-4 p-5 text-[#8e877c] bg-white/[0.02]">
              Standard Criterion
            </div>
            <div className="col-span-4 p-5 text-[#8e877c] bg-white/[0.01] border-x border-white/5">
              Standard Vacation Rentals
            </div>
            <div className="col-span-4 p-5 text-[#d4af37] bg-[#d4af37]/10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary Global Collective</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5 text-xs sm:text-sm">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center hover:bg-white/[0.01] transition-colors">
                <div className="col-span-4 p-5 font-medium">
                  {item.feature}
                </div>
                <div className="col-span-4 p-5 text-[#8e877c] border-x border-white/5 flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                  <span>{item.standardRental}</span>
                </div>
                <div className="col-span-4 p-5 text-[#ede8df] bg-[#d4af37]/[0.03] flex items-start space-x-2 font-medium">
                  <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>{item.sanctuary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The 3 Inspection Modules */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <VolumeX className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-base font-medium">
              Acoustic Decibel Mapping
            </h3>
            <p className="text-xs text-[#a8a194] leading-relaxed">
              Every master suite is acoustically mapped during day and night hours to ensure zero decibel spikes above 22 dB.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-base font-medium">
              Estate Coffee & Tea Standard
            </h3>
            <p className="text-xs text-[#a8a194] leading-relaxed">
              Blue Tokai and Araku Valley micro-lots paired with first-flush single-estate Darjeeling teas and Sub-Zero refrigeration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-base font-medium">
              Turnkey White-Glove Standard
            </h3>
            <p className="text-xs text-[#a8a194] leading-relaxed">
              You are an esteemed guest, not domestic staff. Departure is completely seamless, discreet, and chore-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
