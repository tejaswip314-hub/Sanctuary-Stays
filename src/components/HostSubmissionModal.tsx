'use client';

import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface HostSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostSubmissionModal: React.FC<HostSubmissionModalProps> = ({ isOpen, onClose }) => {
  const [propertyTitle, setPropertyTitle] = useState('');
  const [location, setLocation] = useState('');
  const [architect, setArchitect] = useState('');
  const [style, setStyle] = useState('Rajputana Heritage Monolith');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [agreeToStandards, setAgreeToStandards] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToStandards) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111317] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
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
                <Building2 className="w-3.5 h-3.5" />
                <span>The Jury Review</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-white">
                Submit Your Sanctuary
              </h2>
              <p className="text-xs text-[#a8a194] leading-relaxed">
                We accept only 1.8% of applications. Every home undergoes an in-person acoustic, architectural, and hospitality audit prior to inclusion.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                  Property Name or Estate Identifier
                </label>
                <input
                  required
                  type="text"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  placeholder="e.g. The Monolithic Glass Pavilion"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                    Location (City & State)
                  </label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Udaipur, Rajasthan"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                    Architect or Studio
                  </label>
                  <input
                    required
                    type="text"
                    value={architect}
                    onChange={(e) => setArchitect(e.target.value)}
                    placeholder="e.g. Studio Lotus / Charles Correa"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                    Architectural Movement
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-[#181a20] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="Rajputana Heritage Monolith">Rajputana Heritage Monolith</option>
                    <option value="Indo-Portuguese Modernism">Indo-Portuguese Modernism</option>
                    <option value="Himalayan Rammed Earth">Himalayan Rammed Earth</option>
                    <option value="Kerala Vernacular">Kerala Vernacular</option>
                    <option value="Kumaon Slate Brutalism">Kumaon Slate Brutalism</option>
                    <option value="Tropical Planters Estate">Tropical Planters Estate</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                    Architectural Photo / Portfolio URL
                  </label>
                  <input
                    required
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://dropbox.com/... or website"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#a8a194] block mb-1">
                  Owner / Representative Email
                </label>
                <input
                  required
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="proprietor@estate.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Standard Commitment Checkbox */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
                <input
                  required
                  type="checkbox"
                  id="standardsCheck"
                  checked={agreeToStandards}
                  onChange={(e) => setAgreeToStandards(e.target.checked)}
                  className="mt-0.5 accent-[#d4af37] cursor-pointer"
                />
                <label htmlFor="standardsCheck" className="text-[11px] text-[#cfc9be] cursor-pointer">
                  I agree to Sanctuary’s <strong>Zero-Chore Policy</strong> (hosts provide turnkey departure housekeeping) and consent to an on-site decibel acoustic audit.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !agreeToStandards}
              className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e4c256] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting for Architectural Review...</span>
              ) : (
                <>
                  <span>Submit for Jury Evaluation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37] mx-auto flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="font-editorial text-2xl text-white font-medium">
              Application In Review
            </h3>
            <p className="text-xs text-[#b8b0a2] max-w-sm mx-auto leading-relaxed">
              Your submission for <strong>{propertyTitle || 'your estate'}</strong> has been registered with our curatorial board. We will contact you at {ownerEmail} to schedule an in-person acoustic and aesthetic evaluation.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl border border-white/20 hover:border-[#d4af37] text-xs uppercase tracking-wider text-[#d4af37] transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
