'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Phone, Mail, Clock } from 'lucide-react';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('Private Chef & Dining');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111317] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/80" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>24/7 Private Liaison</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-white">
                Bespoke Concierge Request
              </h2>
              <p className="text-xs text-[#a8a194] leading-relaxed">
                From private Gulfstream charters to Michelin-starred in-villa dinners, our international client liaisons orchestrate every detail.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lorde Harrison"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="liaison@private.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                  Desired Bespoke Experience
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-[#181a20] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="Private Royal Maharaj Chef">In-Villa Royal Maharaj / Regional Master Chef</option>
                  <option value="Private Solar Boat Cruise">Private Sunset Backwater Solar Shikara / River Tender</option>
                  <option value="Helicopter Transfer">Helicopter / Mountain Aviation Transfer</option>
                  <option value="Ayurvedic Vaidya & Spa">Authentic Ayurvedic Vaidya Consultation & Abhyanga</option>
                  <option value="Himalayan Dark Sky Session">High-Altitude Telescope & Dark Sky Guide</option>
                  <option value="Royal Heritage & Textile Atelier">Private Palace & Royal Textile Atelier Access</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                  Specific Itinerary & Preferences
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your dates, guest count, and any bespoke requirements..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e4c256] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Dispatching to Liaison...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Private Concierge</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="font-editorial text-2xl text-white font-medium">
              Concierge Request Received
            </h3>
            <p className="text-xs text-[#b8b0a2] max-w-sm mx-auto leading-relaxed">
              Your inquiry regarding <strong>{serviceType}</strong> has been prioritized. A personal liaison will contact you at {email || phone} within 90 minutes.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl border border-white/20 hover:border-[#d4af37] text-xs uppercase tracking-wider text-[#d4af37] transition-all"
            >
              Return to Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
