'use client';

import React from 'react';
import { CheckCircle, X, ShieldCheck, Calendar, Users, MapPin, Sparkles, Printer } from 'lucide-react';
import { SanctuaryStay, ConciergeAddon } from '../types/sanctuary';

interface BookingConfirmationProps {
  bookingData: {
    sanctuary: SanctuaryStay;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    selectedAddons: ConciergeAddon[];
    subtotal: number;
    conciergeTotal: number;
    taxes: number;
    total: number;
  } | null;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationProps> = ({
  bookingData,
  onClose,
}) => {
  const [bookingCode] = React.useState(() => `SNC-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!bookingData) return null;

  const { sanctuary, checkIn, checkOut, nights, guests, selectedAddons, total } = bookingData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111318] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 hover:bg-white/10 text-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Badge Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#d4af37]/15 border border-[#d4af37] mx-auto flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-[#d4af37]" />
          </div>
          <div className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
            Reservation Confirmed
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-medium">
            Your Sanctuary is Awaiting
          </h2>
          <p className="text-xs text-[#a8a194]">
            Booking Reference: <span className="font-mono text-white font-semibold">{bookingCode}</span>
          </p>
        </div>

        {/* Stay Summary Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-editorial text-lg text-white font-medium">
                {sanctuary.title}
              </h3>
              <div className="flex items-center space-x-1.5 text-xs text-[#b8b0a2] mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {sanctuary.location.city}, {sanctuary.location.state}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-semibold uppercase tracking-wider">
              {sanctuary.architecturalStyle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-[#8e877c] block text-[10px] uppercase">Dates</span>
              <span className="font-medium text-white">
                {checkIn} → {checkOut}
              </span>
            </div>
            <div>
              <span className="text-[#8e877c] block text-[10px] uppercase">Duration</span>
              <span className="font-medium text-white">{nights} Nights</span>
            </div>
            <div>
              <span className="text-[#8e877c] block text-[10px] uppercase">Travelers</span>
              <span className="font-medium text-white">{guests} Guests</span>
            </div>
          </div>
        </div>

        {/* Concierge Services Section */}
        {selectedAddons.length > 0 && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Requested Concierge Add-Ons
            </div>
            <ul className="text-xs text-[#cfc9be] space-y-1">
              {selectedAddons.map((addon) => (
                <li key={addon.id} className="flex justify-between">
                  <span>• {addon.title}</span>
                  <span className="text-[#d4af37]">+₹{addon.pricePerDayOrService.toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assigned Liaison Note */}
        <div className="p-4 rounded-xl bg-[#141820] border-l-2 border-[#d4af37] text-xs space-y-1">
          <div className="font-medium text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            Personal Concierge Assigned
          </div>
          <p className="text-[#a8a194] leading-relaxed">
            Your dedicated Sanctuary Private Liaison will reach out via WhatsApp and email within 2 hours to confirm your arrival logistics, dietary preferences, and turnkey departure requests.
          </p>
        </div>

        {/* Total & Action */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8e877c]">Total Charged</div>
            <div className="font-editorial text-2xl font-bold text-[#d4af37]">
              ₹{total.toLocaleString('en-IN')} INR
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl border border-white/10 hover:border-white/30 text-white/80 transition-colors"
              title="Print Itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e4c256] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#d4af37]/20"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
