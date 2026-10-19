'use client';

import React, { useState } from 'react';
import { SanctuaryStay, ConciergeAddon } from '../types/sanctuary';
import { groupAmenities } from '../data/amenityCatalog';
import { StayLocationMap } from './StayLocationMap';
import {
  X,
  Star,
  MapPin,
  Sparkles,
  VolumeX,
  Wifi,
  Coffee,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Heart,
  ChevronRight,
  Maximize2,
  Clock,
  Wine,
  Moon,
  Shield,
  Activity,
  Quote,
  Waves,
  Flame,
  UtensilsCrossed,
  BatteryCharging,
  Dumbbell,
  Car,
  Trees,
  Music,
  Wind,
} from 'lucide-react';

function amenityIcon(label: string) {
  const l = label.toLowerCase();
  if (/(spa|massage|hammam|wellness|therapist)/.test(l)) return Sparkles;
  if (/(sauna|steam|fire|bonfire|barbecue|bbq|heating|fireplace)/.test(l)) return Flame;
  if (/(chef|dining|kitchen|cook|feast|culinary|sommelier)/.test(l)) return UtensilsCrossed;
  if (/(coffee|espresso|tea|refreshment|hamper)/.test(l)) return Coffee;
  if (/(pool|plunge|jetty|boat|kayak|paddle|river|beach|lake|sea|ocean|waterfront)/.test(l)) return Waves;
  if (/(wi-fi|wifi|internet|fibre|fiber|broadband)/.test(l)) return Wifi;
  if (/(ev charger|charging|charger)/.test(l)) return BatteryCharging;
  if (/(gym|fitness|yoga|studio)/.test(l)) return Dumbbell;
  if (/(chauffeur|car hire|car|transfer|driver)/.test(l)) return Car;
  if (/(trail|trek|mountain|forest|garden|estate|nature|plantation|walk|orchard|stargaz|birdwatching|wildlife)/.test(l)) return Trees;
  if (/(music|vinyl|sound|bluetooth|library|games|book)/.test(l)) return Music;
  if (/(climate|air purification|wind)/.test(l)) return Wind;
  if (/(linen|linens|bed|pillow|drapes|sleep)/.test(l)) return Moon;
  if (/(security|safe|concierge|butler|manager|host|liaison|guide)/.test(l)) return ShieldCheck;
  return CheckCircle2;
}

interface SanctuaryDetailModalProps {
  sanctuary: SanctuaryStay | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSaved: (id: string) => void;
  isDarkTheme?: boolean;
  onConfirmBooking: (bookingData: {
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
  }) => void;
}

export const SanctuaryDetailModal: React.FC<SanctuaryDetailModalProps> = ({
  sanctuary,
  onClose,
  isSaved,
  onToggleSaved,
  isDarkTheme = true,
  onConfirmBooking,
}) => {
  const [activePhoto, setActivePhoto] = useState(sanctuary?.coverImage || '');
  const [checkInDate, setCheckInDate] = useState('2026-11-12');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-16');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  if (!sanctuary) return null;

  // Calculate nights
  const calculateNights = () => {
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24));
    return diff > 0 ? diff : sanctuary.rules.minimumNights;
  };

  const nights = calculateNights();
  const subtotal = nights * sanctuary.nightlyPrice;

  // Selected concierge addons
  const selectedAddons = sanctuary.availableConciergeServices.filter((addon) =>
    selectedAddonIds.includes(addon.id)
  );

  const conciergeTotal = selectedAddons.reduce((sum, addon) => {
    return sum + (addon.unit === 'per day' ? addon.pricePerDayOrService * nights : addon.pricePerDayOrService);
  }, 0);

  const taxesAndService = Math.round((subtotal + conciergeTotal) * 0.12);
  const total = subtotal + conciergeTotal + taxesAndService;

  const amenityGroups = groupAmenities(sanctuary.amenities);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReserve = () => {
    onConfirmBooking({
      sanctuary,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: guestsCount,
      selectedAddons,
      subtotal,
      conciergeTotal,
      taxes: taxesAndService,
      total,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-6xl border rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col transition-colors ${
          isDarkTheme
            ? 'bg-[#0e1014] border-white/15 text-white'
            : 'bg-white border-black/10 text-stone-900'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b ${
            isDarkTheme
              ? 'bg-[#0e1014]/90 border-white/10'
              : 'bg-white/90 border-stone-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-semibold uppercase tracking-wider">
              {sanctuary.collection}
            </span>
            <span className="hidden sm:inline text-xs text-[#a8a194]">•</span>
            <span className="hidden sm:inline text-xs text-[#a8a194]">
              {sanctuary.architecturalStyle}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleSaved(sanctuary.id)}
              className="p-2 rounded-full border border-white/15 hover:border-[#d4af37] transition-all bg-white/5"
              title="Save to curations"
            >
              <Heart
                className={`w-4 h-4 ${
                  isSaved ? 'text-[#d4af37] fill-[#d4af37]' : isDarkTheme ? 'text-white' : 'text-stone-700'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/15 hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-white/80 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          {/* Main Title & Provenance */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-editorial text-2xl sm:text-4xl font-medium">
                  {sanctuary.title}
                </h1>
                <div className="flex items-center space-x-2 mt-2 text-sm text-[#a8a194]">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    {sanctuary.location.city}, {sanctuary.location.state}, {sanctuary.location.country}
                  </span>
                  <span>•</span>
                  <span>{sanctuary.sqft.toLocaleString()} sq ft</span>
                  <span>•</span>
                  <span>{sanctuary.bedrooms} Bedrooms</span>
                  <span>•</span>
                  <span>{sanctuary.bathrooms} Bathrooms</span>
                </div>
              </div>

              {/* Vetting Score Plaque */}
              <div className="flex items-center space-x-3 p-3 px-4 rounded-2xl bg-white/[0.04] border border-[#d4af37]/30">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#a8a194]">
                    Vetting Standard Audit
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-editorial text-2xl font-bold text-[#d4af37]">
                      {sanctuary.vettingAudit.overallScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-white/50">/ 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Magazine Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
              <img
                src={activePhoto}
                alt={sanctuary.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs text-white flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Architectural Digest Certified Photography</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="grid grid-cols-4 gap-3">
              {sanctuary.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(img)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhoto === img
                      ? 'border-[#d4af37] scale-[1.02] shadow-lg shadow-[#d4af37]/20'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Grid: Left (Story, Acoustic Radar & Reviews) / Right (Reservation Engine) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Architect Profile */}
              {sanctuary.architect && (
                <div
                  className={`p-5 rounded-2xl border ${
                    isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold mb-1">
                    Architectural Provenance • Built {sanctuary.architect.yearBuilt}
                  </div>
                  <div className="text-base font-editorial">
                    {sanctuary.architect.name}
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-[#a8a194] leading-relaxed">
                    {sanctuary.architect.description}
                  </p>
                </div>
              )}

              {/* Editorial Description */}
              <div>
                <h3 className="font-editorial text-xl mb-3">The Sanctuary Story</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line font-light opacity-90">
                  {sanctuary.description}
                </p>
              </div>

              {/* Location & Neighborhood Map */}
              <div className="space-y-3">
                <h3 className="font-editorial text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                  Location & Neighborhood
                </h3>
                <StayLocationMap stay={sanctuary} isDarkTheme={isDarkTheme} height={280} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border space-y-1 ${isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1.5 text-[#d4af37] uppercase text-[10px] font-semibold">
                      <VolumeX className="w-3 h-3" /> Acoustics
                    </div>
                    <div className="opacity-90 leading-snug">{sanctuary.neighborhoodVibe.noiseLevel}</div>
                  </div>
                  <div className={`p-3 rounded-xl border space-y-1 ${isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1.5 text-[#d4af37] uppercase text-[10px] font-semibold">
                      <Moon className="w-3 h-3" /> Dark Sky
                    </div>
                    <div className="opacity-90 leading-snug">{sanctuary.neighborhoodVibe.darkSkyClass}</div>
                  </div>
                  <div className={`p-3 rounded-xl border space-y-1 ${isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1.5 text-[#d4af37] uppercase text-[10px] font-semibold">
                      <Shield className="w-3 h-3" /> Privacy
                    </div>
                    <div className="opacity-90 leading-snug">{sanctuary.neighborhoodVibe.privacyScore} / 100</div>
                  </div>
                  <div className={`p-3 rounded-xl border space-y-1 ${isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1.5 text-[#d4af37] uppercase text-[10px] font-semibold">
                      <Clock className="w-3 h-3" /> Airport
                    </div>
                    <div className="opacity-90 leading-snug">{sanctuary.neighborhoodVibe.nearestAirportMins} mins drive</div>
                  </div>
                  <div className={`p-3 rounded-xl border space-y-1 col-span-2 sm:col-span-2 ${isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1.5 text-[#d4af37] uppercase text-[10px] font-semibold">
                      <UtensilsCrossed className="w-3 h-3" /> Culinary Proximity
                    </div>
                    <div className="opacity-90 leading-snug">{sanctuary.neighborhoodVibe.culinaryProximity}</div>
                  </div>
                </div>
              </div>

              {/* Amenities & Guest Services */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    Amenities & Guest Services
                  </h3>
                  <span className="text-xs text-[#a8a194]">{sanctuary.amenities.length} included</span>
                </div>

                <div className="space-y-4">
                  {amenityGroups.map((group) => {
                    const items = showAllAmenities ? group.items : group.items.slice(0, 4);
                    return (
                      <div key={group.label} className="space-y-2">
                        <div className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold">
                          {group.label}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {items.map((item) => {
                            const Icon = amenityIcon(item);
                            return (
                              <div
                                key={item}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${
                                  isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
                                }`}
                              >
                                <Icon className="w-4 h-4 text-[#d4af37] shrink-0" />
                                <span className="text-xs leading-snug">{item}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowAllAmenities((prev) => !prev)}
                  className={`w-full py-2.5 rounded-xl border text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    isDarkTheme
                      ? 'border-white/15 text-[#d4af37] hover:border-[#d4af37]/60 hover:bg-white/5'
                      : 'border-stone-300 text-[#b38947] hover:border-[#b38947] hover:bg-stone-100'
                  }`}
                >
                  {showAllAmenities
                    ? 'Show fewer amenities'
                    : `Show all ${sanctuary.amenities.length} amenities`}
                </button>
              </div>

              {/* Curator Jury Quote */}
              <div
                className={`p-5 rounded-2xl border-l-4 border-[#d4af37] space-y-2 ${
                  isDarkTheme ? 'bg-[#171a21]' : 'bg-[#faf7f0]'
                }`}
              >
                <p className="italic text-sm font-serif">
                  &ldquo;{sanctuary.curatorQuote}&rdquo;
                </p>
                <div className="text-xs text-[#a8a194] uppercase tracking-wider">
                  — {sanctuary.curatorName}
                </div>
              </div>

              {/* The 100-Point Vetting Standard Audit & Frequency Spectrum */}
              <div
                className={`p-6 rounded-2xl border ${
                  isDarkTheme
                    ? 'bg-gradient-to-br from-white/[0.05] to-transparent border-[#d4af37]/30'
                    : 'bg-stone-50 border-[#b38947]/30'
                } space-y-6`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-white/10">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-editorial text-lg">
                      Jury Audit Scorecard & Frequency Spectrum
                    </h3>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
                    100-Point Audit
                  </span>
                </div>

                {/* Acoustic Isolation Frequency Bars */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium flex items-center gap-1.5 text-[#d4af37]">
                      <Activity className="w-3.5 h-3.5" />
                      In-Room Acoustic Frequency Isolation Chart
                    </span>
                    <span className="text-[11px] text-[#a8a194]">
                      Overall: {sanctuary.vettingAudit.acousticLevelDb} dB
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Low Freq Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#a8a194] mb-1">
                        <span>Low Frequency (125-250 Hz Traffic & Bass rumble)</span>
                        <span className="font-mono text-white font-semibold">
                          {sanctuary.vettingAudit.acousticFrequencies.lowFreqIsolationDb} dB
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#d4af37] h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(sanctuary.vettingAudit.acousticFrequencies.lowFreqIsolationDb / 30) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Mid Freq Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#a8a194] mb-1">
                        <span>Mid Frequency (500-1000 Hz Speech & Ambient noise)</span>
                        <span className="font-mono text-white font-semibold">
                          {sanctuary.vettingAudit.acousticFrequencies.midFreqIsolationDb} dB
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#d4af37] h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(sanctuary.vettingAudit.acousticFrequencies.midFreqIsolationDb / 30) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* High Freq Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#a8a194] mb-1">
                        <span>High Frequency (2k-4k Hz Wind turbulence)</span>
                        <span className="font-mono text-white font-semibold">
                          {sanctuary.vettingAudit.acousticFrequencies.highFreqIsolationDb} dB
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#d4af37] h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(sanctuary.vettingAudit.acousticFrequencies.highFreqIsolationDb / 30) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#a8a194] pt-1">
                    <strong>Glazing Spec:</strong> {sanctuary.vettingAudit.acousticFrequencies.glassGlazingType}
                  </div>
                </div>

                {/* Scorecard Sub-Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <div className="flex items-center space-x-1.5 text-[#d4af37]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase text-[10px]">Bedding & Sleep Standard</span>
                    </div>
                    <div className="font-medium truncate">{sanctuary.vettingAudit.beddingBrand}</div>
                    <div className="text-[11px] text-[#a8a194]">Score: {sanctuary.vettingAudit.beddingScore}/100</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <div className="flex items-center space-x-1.5 text-[#d4af37]">
                      <Coffee className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase text-[10px]">Culinary Standard</span>
                    </div>
                    <div className="font-medium truncate">{sanctuary.vettingAudit.artisanCoffee}</div>
                    <div className="text-[11px] text-[#a8a194]">Score: {sanctuary.vettingAudit.culinaryScore}/100</div>
                  </div>
                </div>

                {/* Zero Chore Policy Banner */}
                <div className="p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>
                    <strong>Zero-Chore Departure Guarantee:</strong> Guests are never asked to strip beds, wash dishes, or take out garbage. Housekeeping manages everything.
                  </span>
                </div>
              </div>

              {/* Verified Guest Reviews & Testimonials */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-lg flex items-center gap-2">
                    <Quote className="w-4 h-4 text-[#d4af37]" />
                    <span>Verified Traveler Testimonials</span>
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-[#d4af37]">
                    <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                    <span className="font-semibold">{sanctuary.rating}</span>
                    <span className="text-white/40">({sanctuary.reviews.length} Audited Reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {sanctuary.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-2xl border space-y-2 text-xs ${
                        isDarkTheme ? 'bg-white/[0.02] border-white/10' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{rev.guestName}</div>
                          <div className="text-[11px] text-[#a8a194]">{rev.guestRole} • {rev.stayDate}</div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-medium">
                          ✦ {rev.vettedHighlight}
                        </span>
                      </div>
                      <p className="italic text-[#c8c2b7] leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Reservation & Bespoke Concierge Add-ons (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div
                className={`p-6 rounded-3xl border shadow-2xl space-y-6 ${
                  isDarkTheme ? 'bg-[#13161c] border-white/15' : 'bg-stone-50 border-stone-200'
                }`}
              >
                {/* Nightly price header */}
                <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="font-editorial text-3xl font-bold">
                      ₹{sanctuary.nightlyPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#a8a194]"> / night</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-[#d4af37]">
                    <Star className="w-4 h-4 fill-[#d4af37]" />
                    <span className="font-semibold">{sanctuary.rating}</span>
                    <span className="text-white/40">({sanctuary.reviewCount})</span>
                  </div>
                </div>

                {/* Date and Guest Pickers */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#a8a194] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#d4af37]" /> Check-In
                      </label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-transparent text-xs focus:outline-none cursor-pointer"
                      />
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#a8a194] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#d4af37]" /> Check-Out
                      </label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full bg-transparent text-xs focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#a8a194] flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#d4af37]" /> Guests
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full bg-transparent text-xs focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: sanctuary.guestCapacity }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num} className="bg-[#121418] text-white">
                          {num} {num === 1 ? 'Guest' : 'Guests'} (Max {sanctuary.guestCapacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bespoke Concierge Add-On Selector */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5" />
                      In-Villa Concierge Add-Ons
                    </span>
                    <span className="text-[10px] text-[#a8a194]">Optional</span>
                  </div>

                  <div className="space-y-2">
                    {sanctuary.availableConciergeServices.map((addon) => {
                      const isSelected = selectedAddonIds.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#d4af37]/15 border-[#d4af37]'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="accent-[#d4af37] cursor-pointer"
                              />
                              <span className="font-medium">{addon.title}</span>
                            </div>
                            <span className="text-[#d4af37] font-semibold whitespace-nowrap ml-2">
                              +₹{addon.pricePerDayOrService.toLocaleString('en-IN')}{' '}
                              <span className="text-[10px] font-normal opacity-70">{addon.unit}</span>
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-[#a8a194] pl-5">{addon.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-[#a8a194]">
                  <div className="flex justify-between">
                    <span>
                      ₹{sanctuary.nightlyPrice.toLocaleString('en-IN')} × {nights} {nights === 1 ? 'night' : 'nights'}
                    </span>
                    <span className="font-medium text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {conciergeTotal > 0 && (
                    <div className="flex justify-between text-[#d4af37]">
                      <span>Bespoke Concierge Add-ons</span>
                      <span>+₹{conciergeTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Luxury Hospitality & GST (12%)</span>
                    <span>₹{taxesAndService.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-[#bfa07a]">
                    <span>Departure Housekeeping & Linen Care</span>
                    <span className="uppercase text-[10px] tracking-wider font-semibold">
                      ₹0 (Turnkey Standard)
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-white/15 text-sm font-semibold">
                    <span className="font-editorial text-base">Total Investment</span>
                    <span className="font-editorial text-2xl text-[#d4af37]">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Reserve Action Button */}
                <button
                  onClick={handleReserve}
                  className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e4c256] text-black font-semibold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#d4af37]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Reserve {sanctuary.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
