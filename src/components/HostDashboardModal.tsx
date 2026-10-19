'use client';

import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  VolumeX,
  Building,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

interface HostDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
}

export const HostDashboardModal: React.FC<HostDashboardModalProps> = ({
  isOpen,
  onClose,
  isDarkTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'reservations' | 'housekeeping'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border shadow-2xl flex flex-col transition-colors ${
          isDarkTheme
            ? 'bg-[#101217] border-white/15 text-white'
            : 'bg-white border-black/10 text-stone-900'
        }`}
      >
        {/* Top Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDarkTheme ? 'border-white/10 bg-[#101217]' : 'border-stone-200 bg-stone-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  Proprietor Portal
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                  Active Sanctuary Owner
                </span>
              </div>
              <h2 className="font-editorial text-lg sm:text-xl font-medium">
                The Aravalli Sandstone Bastion • Udaipur #SNC-01
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full border transition-colors ${
              isDarkTheme
                ? 'border-white/10 hover:bg-white/10 text-white/80'
                : 'border-stone-300 hover:bg-stone-100 text-stone-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`px-6 flex space-x-6 border-b text-xs uppercase tracking-wider font-medium overflow-x-auto ${
            isDarkTheme ? 'border-white/10' : 'border-stone-200'
          }`}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#d4af37] text-[#d4af37]'
                : isDarkTheme
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Earnings & Metrics
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-[#d4af37] text-[#d4af37]'
                : isDarkTheme
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Jury Vetting Audit (99.4)
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'border-[#d4af37] text-[#d4af37]'
                : isDarkTheme
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Upcoming Reservations (4)
          </button>
          <button
            onClick={() => setActiveTab('housekeeping')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'housekeeping'
                ? 'border-[#d4af37] text-[#d4af37]'
                : isDarkTheme
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Turnkey Housekeeping Dispatch
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#a8a194] mb-1">
                    <span>YTD Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div className="font-editorial text-2xl font-bold text-[#d4af37]">₹1,48,25,000</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+24% vs boutique benchmark</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#a8a194] mb-1">
                    <span>Average Daily Rate (ADR)</span>
                    <DollarSign className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div className="font-editorial text-2xl font-bold">₹1,25,000</div>
                  <div className="text-[11px] text-[#a8a194] mt-1">Zero price discount policy</div>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#a8a194] mb-1">
                    <span>Occupancy Rate</span>
                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div className="font-editorial text-2xl font-bold">84.2%</div>
                  <div className="text-[11px] text-[#a8a194] mt-1">Capped at 22 nights/mo</div>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#a8a194] mb-1">
                    <span>Next Net Payout</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-editorial text-2xl font-bold text-emerald-400">₹18,42,000</div>
                  <div className="text-[11px] text-[#a8a194] mt-1">Initiating Oct 15 via RTGS</div>
                </div>
              </div>

              {/* Curation Performance Banner */}
              <div
                className={`p-6 rounded-2xl border ${
                  isDarkTheme
                    ? 'bg-[#151821] border-[#d4af37]/30'
                    : 'bg-[#faf6ee] border-[#b38947]/30'
                } flex flex-col md:flex-row items-center justify-between gap-4`}
              >
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Proprietor Standing: Top 0.5% Global
                  </div>
                  <h3 className="font-editorial text-lg font-medium">
                    100% Five-Star Traveler Satisfaction Rate
                  </h3>
                  <p className="text-xs text-[#9d9588]">
                    Your zero-chore compliance and discreet turnkey turnover has earned Sanctuary Super-Curated status.
                  </p>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e4c256] text-black font-semibold text-xs tracking-wider uppercase transition-all shrink-0">
                  Manage Calendar Dates
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div
                className={`p-6 rounded-2xl border ${
                  isDarkTheme ? 'bg-white/[0.02] border-white/10' : 'bg-stone-50 border-stone-200'
                } space-y-4`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-white/10">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-editorial text-lg font-medium">
                      Jury Audit Inspection Certificate: 99.4 / 100
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs font-semibold">
                    Valid through Oct 2027
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1">
                    <div className="text-[#d4af37] font-semibold uppercase text-[10px]">Acoustic Test</div>
                    <div className="font-medium">22 dB (Whisper-Quiet) — Passed</div>
                    <div className="text-[11px] text-[#8e877c]">Calibrated Brüel & Kjær Type 2250 sound meter verified.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1">
                    <div className="text-[#d4af37] font-semibold uppercase text-[10px]">Linen & Bedding</div>
                    <div className="font-medium">Cultiver Belgian Linen / Hästens — Passed</div>
                    <div className="text-[11px] text-[#8e877c]">Natural horsehair core, hypoallergenic certified.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1">
                    <div className="text-[#d4af37] font-semibold uppercase text-[10px]">Turnkey Departure</div>
                    <div className="font-medium">Zero-Chore Protocol — 100% Compliant</div>
                    <div className="text-[11px] text-[#8e877c]">Guests never requested to do domestic labor.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1">
                    <div className="text-[#d4af37] font-semibold uppercase text-[10px]">Fiber Connectivity</div>
                    <div className="font-medium">680 Mbps Symmetrical — Passed</div>
                    <div className="text-[11px] text-[#8e877c]">Tested latency 8ms with dedicated mesh access points.</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-xs">
                  <div className="font-semibold text-[#d4af37] mb-1">
                    Jury Recommendation for 99.9 Pinnacle Tier:
                  </div>
                  <p className="text-[#a8a194]">
                    Add a second dedicated EV DC fast-charger and install a custom cedarwood cold plunge chiller set to a constant 42°F to qualify for the Global Architecture Laureate badge.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {[
                {
                  code: 'SNC-IN-849201',
                  guest: 'Ananya Singhania (Architectural Director, Mumbai)',
                  dates: 'Nov 12 – Nov 16, 2026 (4 nights)',
                  guests: '4 Guests',
                  total: '₹5,00,000',
                  addons: ['Royal Maharaj Chef', 'Lake Pichola Solar Cruise'],
                  status: 'CONFIRMED',
                },
                {
                  code: 'SNC-IN-910482',
                  guest: 'Vikramaditya Mittal (Industrialist, New Delhi)',
                  dates: 'Nov 22 – Nov 28, 2026 (6 nights)',
                  guests: '6 Guests',
                  total: '₹7,50,000',
                  addons: ['Helicopter Transfer', 'Daily Khansama Turndown'],
                  status: 'CONFIRMED',
                },
              ].map((res) => (
                <div
                  key={res.code}
                  className={`p-5 rounded-2xl border ${
                    isDarkTheme ? 'bg-white/[0.02] border-white/10' : 'bg-stone-50 border-stone-200'
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#d4af37] font-semibold">
                        {res.code}
                      </span>
                      <h4 className="font-editorial text-base font-medium">{res.guest}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#a8a194]">
                    <div>Dates: <span className="text-white font-medium">{res.dates}</span></div>
                    <div>Party: <span className="text-white font-medium">{res.guests}</span></div>
                    <div>Payout: <span className="text-[#d4af37] font-medium">{res.total}</span></div>
                    <div>Concierge: <span className="text-white font-medium">{res.addons.join(', ')}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'housekeeping' && (
            <div className="space-y-4">
              <div
                className={`p-5 rounded-2xl border ${
                  isDarkTheme ? 'bg-white/[0.02] border-white/10' : 'bg-stone-50 border-stone-200'
                } space-y-3`}
              >
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>White-Glove Turnkey Team: Sanctuary Operations Guild #4</span>
                </div>
                <h4 className="font-editorial text-base">
                  Automated Departure Cleaning & Linen Turnaround
                </h4>
                <p className="text-xs text-[#a8a194] leading-relaxed">
                  In accordance with the Sanctuary Charter, all housekeeping costs are funded through collective membership dues. When guests depart, our 4-person certified team deploys within 45 minutes for hospital-grade steam sanitization and Cultiver Belgian linen reset.
                </p>
                <div className="pt-2 flex items-center space-x-3 text-xs">
                  <button className="px-4 py-2 rounded-xl border border-white/20 hover:border-[#d4af37] text-[#d4af37] transition-all">
                    Schedule Special Deep Clean
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    Contact Estate Turnaround Lead
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
