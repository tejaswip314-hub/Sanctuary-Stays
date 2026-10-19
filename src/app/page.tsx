'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { CategoryPills } from '../components/CategoryPills';
import { SanctuaryCard } from '../components/SanctuaryCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { Reveal } from '../components/Reveal';
import { SanctuaryDetailModal } from '../components/SanctuaryDetailModal';
import { BookingConfirmationModal } from '../components/BookingConfirmationModal';
import { VettingStandardSection } from '../components/VettingStandardSection';
import { ConciergeModal } from '../components/ConciergeModal';
import { HostSubmissionModal } from '../components/HostSubmissionModal';
import { HostDashboardModal } from '../components/HostDashboardModal';
import { SavedStaysModal } from '../components/SavedStaysModal';
import { Footer } from '../components/Footer';
import AuthModal from '../components/AuthModal';
import ReservationsModal from '../components/ReservationsModal';
import { SANCTUARIES } from '../data/sanctuaries';
import { SanctuaryStay, ConciergeAddon } from '../types/sanctuary';
import { User } from '../types/auth';
import { SEED_USERS } from '../lib/auth/store';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
  LayoutGrid,
  Columns,
  Map as MapIcon,
} from 'lucide-react';

export default function HomePage() {
  // Theme state: dark (Midnight Obsidian) vs light (Warm Editorial Linen)
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // User and RBAC state
  const [currentUser, setCurrentUser] = useState<User | null>(SEED_USERS[0]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);

  // Layout View mode: 'split' | 'grid' | 'map'
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');

  // Filters state
  const [selectedLocation, setSelectedLocation] = useState('All Destinations');
  const [selectedStyle, setSelectedStyle] = useState('All Architectural Styles');
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [minVettingScore, setMinVettingScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('All');

  // Interactive UI state
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedSanctuary, setSelectedSanctuary] = useState<SanctuaryStay | null>(null);
  const [hoveredSanctuaryId, setHoveredSanctuaryId] = useState<string | null>(null);

  const [confirmedBookingData, setConfirmedBookingData] = useState<{
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
  } | null>(null);

  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isHostDashboardOpen, setIsHostDashboardOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Sync theme with document element
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('sanctuary_theme');
      if (storedTheme === 'light') {
        queueMicrotask(() => setIsDarkTheme(false));
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('theme-light');
      } else {
        queueMicrotask(() => setIsDarkTheme(true));
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('theme-light');
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sanctuary_theme', next ? 'dark' : 'light');
        if (next) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('theme-light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('theme-light');
        }
      } catch (e) {}
      return next;
    });
  };

  // Load saved wishlists from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sanctuary_saved_stays');
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => setSavedIds(parsed));
      }
    } catch (e) {}
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('sanctuary_saved_stays', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleResetFilters = () => {
    setSelectedLocation('All Destinations');
    setSelectedStyle('All Architectural Styles');
    setSelectedGuests(1);
    setMinVettingScore(0);
    setSearchQuery('');
    setSelectedCollection('All');
  };

  // Filtered Sanctuaries
  const filteredSanctuaries = useMemo(() => {
    return SANCTUARIES.filter((stay) => {
      if (selectedCollection !== 'All' && stay.collection !== selectedCollection) {
        return false;
      }

      if (
        selectedLocation !== 'All Destinations' &&
        !stay.location.country.toLowerCase().includes(selectedLocation.toLowerCase()) &&
        !stay.location.state.toLowerCase().includes(selectedLocation.toLowerCase()) &&
        !stay.location.city.toLowerCase().includes(selectedLocation.toLowerCase())
      ) {
        return false;
      }

      if (
        selectedStyle !== 'All Architectural Styles' &&
        stay.architecturalStyle !== selectedStyle
      ) {
        return false;
      }

      if (stay.guestCapacity < selectedGuests) {
        return false;
      }

      if (minVettingScore > 0 && stay.vettingAudit.overallScore < minVettingScore) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = stay.title.toLowerCase().includes(query);
        const matchesSubtitle = stay.subtitle.toLowerCase().includes(query);
        const matchesCity = stay.location.city.toLowerCase().includes(query);
        const matchesState = stay.location.state.toLowerCase().includes(query);
        const matchesArchitect = stay.architect?.name.toLowerCase().includes(query) ?? false;
        const matchesAmenities = stay.amenities.some((a) => a.toLowerCase().includes(query));

        if (!matchesTitle && !matchesSubtitle && !matchesCity && !matchesState && !matchesArchitect && !matchesAmenities) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedCollection,
    selectedLocation,
    selectedStyle,
    selectedGuests,
    minVettingScore,
    searchQuery,
  ]);

  const savedSanctuaries = useMemo(() => {
    return SANCTUARIES.filter((stay) => savedIds.includes(stay.id));
  }, [savedIds]);

  const handleBookingConfirm = async (bookingData: {
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
  }) => {
    try {
      const idempotencyKey = `snc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          sanctuaryId: bookingData.sanctuary.id,
          guestId: currentUser?.id || 'usr_guest_01',
          guestName: currentUser?.name || 'Aarav Sharma',
          guestEmail: currentUser?.email || 'aarav@sanctuaryguest.in',
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          action: 'CONFIRM',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Inventory allocation conflict: dates already reserved or held.');
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setSelectedSanctuary(null);
    setConfirmedBookingData(bookingData);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkTheme ? 'bg-[#0b0c0e] text-[#ede8df]' : 'bg-[#fbf9f5] text-[#1c1917]'
      }`}
    >
      {/* Navigation */}
      <Navbar
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenHostDashboard={() => setIsHostDashboardOpen(true)}
        onOpenReservations={() => setIsReservationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onScrollToStandard={() => {
          const el = document.getElementById('the-standard');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        isDarkTheme={isDarkTheme}
        onToggleTheme={toggleTheme}
      />

      {/* Hero section */}
      <Hero />

      {/* Search & Filter Bar */}
      <SearchFilterBar
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        selectedGuests={selectedGuests}
        onGuestsChange={setSelectedGuests}
        minVettingScore={minVettingScore}
        onVettingScoreChange={setMinVettingScore}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onReset={handleResetFilters}
      />

      {/* Category Pills */}
      <CategoryPills
        selectedCollection={selectedCollection}
        onSelectCollection={setSelectedCollection}
      />

      {/* Stays & Interactive Map Explorer Section */}
      <main id="sanctuaries-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Explorer Header & View Layout Switcher */}
        <div className="animate-fade-up flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b pb-4 border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audited Global Portfolio</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium mt-1">
              {selectedCollection === 'All' ? 'The Global Collective' : selectedCollection}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* Layout Mode Selector (Split-Screen vs Grid vs Full Map) */}
            <div
              className={`p-1 rounded-xl border flex items-center space-x-1 ${
                isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
            >
              <button
                onClick={() => setViewMode('split')}
                title="Split-Screen Map & Feed View"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#a8a194] hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Split Map</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                title="Editorial Grid View"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#a8a194] hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                title="Full-Width Map View"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#a8a194] hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full Map</span>
              </button>
            </div>

            <div className="text-xs text-[#a8a194] hidden lg:block">
              {filteredSanctuaries.length} Stays Available
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredSanctuaries.length === 0 ? (
          <div className="py-24 text-center space-y-4 rounded-3xl border border-white/10 bg-white/[0.01]">
            <SlidersHorizontal className="w-10 h-10 text-white/30 mx-auto" />
            <h3 className="font-editorial text-xl">No sanctuaries match your criteria</h3>
            <p className="text-xs text-[#a8a194] max-w-md mx-auto">
              Our standards are strict; only 1.8% of properties are approved. Try adjusting your guest capacity, destination, or vetting threshold.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-6 py-2.5 rounded-full border border-[#d4af37] text-xs uppercase tracking-wider text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'split' ? (
          /* SPLIT-SCREEN VIEW: Left Listings Feed + Right Interactive Map */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Feed (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredSanctuaries.map((stay, idx) => (
                  <Reveal key={stay.id} delay={(idx % 4) * 70}>
                    <SanctuaryCard
                      sanctuary={stay}
                      isSaved={savedIds.includes(stay.id)}
                      onToggleSaved={toggleSave}
                      onSelect={setSelectedSanctuary}
                      isHovered={hoveredSanctuaryId === stay.id}
                      onHover={setHoveredSanctuaryId}
                      isDarkTheme={isDarkTheme}
                    />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Right Map (6 cols, Sticky viewport height) */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 h-[650px] w-full">
              <InteractiveMap
                sanctuaries={filteredSanctuaries}
                selectedSanctuary={selectedSanctuary}
                hoveredSanctuaryId={hoveredSanctuaryId}
                onHoverSanctuary={setHoveredSanctuaryId}
                onSelectSanctuary={setSelectedSanctuary}
                isDarkTheme={isDarkTheme}
              />
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW: 3-column classic magazine card deck */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSanctuaries.map((stay, idx) => (
              <Reveal key={stay.id} delay={(idx % 3) * 80}>
                <SanctuaryCard
                  sanctuary={stay}
                  isSaved={savedIds.includes(stay.id)}
                  onToggleSaved={toggleSave}
                  onSelect={setSelectedSanctuary}
                  isHovered={hoveredSanctuaryId === stay.id}
                  onHover={setHoveredSanctuaryId}
                  isDarkTheme={isDarkTheme}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          /* FULL MAP VIEW: Full-width interactive map */
          <div className="h-[700px] w-full">
            <InteractiveMap
              sanctuaries={filteredSanctuaries}
              selectedSanctuary={selectedSanctuary}
              hoveredSanctuaryId={hoveredSanctuaryId}
              onHoverSanctuary={setHoveredSanctuaryId}
              onSelectSanctuary={setSelectedSanctuary}
              isDarkTheme={isDarkTheme}
            />
          </div>
        )}

        {/* Private Curation Banner */}
        <Reveal className="mt-20">
        <div
          className={`p-8 sm:p-10 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl ${
            isDarkTheme
              ? 'bg-gradient-to-r from-[#171a22] to-[#111317] border-[#d4af37]/30'
              : 'bg-gradient-to-r from-[#f4eee4] to-[#f9f5ed] border-[#b38947]/30'
          }`}
        >
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              Bespoke Private Client Services
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl">
              Seeking an unlisted architectural masterpiece?
            </h3>
            <p className="text-xs text-[#a8a194] leading-relaxed">
              Certain landmark fortresses in Rajasthan, private coffee estates in Coorg, and secret backwater sanctuaries in Kerala are accessible exclusively through private liaison introductions.
            </p>
          </div>
          <button
            onClick={() => setIsConciergeOpen(true)}
            className="px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#e4c256] text-black font-semibold text-xs tracking-wider uppercase transition-all shrink-0 flex items-center space-x-2 shadow-lg shadow-[#d4af37]/20 cursor-pointer"
          >
            <span>Inquire With Concierge</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        </Reveal>
      </main>

      {/* The 100-Point Vetting Standard Section */}
      <VettingStandardSection />

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      {selectedSanctuary && (
        <SanctuaryDetailModal
          key={selectedSanctuary.id}
          sanctuary={selectedSanctuary}
          onClose={() => setSelectedSanctuary(null)}
          isSaved={savedIds.includes(selectedSanctuary.id)}
          onToggleSaved={toggleSave}
          isDarkTheme={isDarkTheme}
          onConfirmBooking={handleBookingConfirm}
        />
      )}

      {confirmedBookingData && (
        <BookingConfirmationModal
          bookingData={confirmedBookingData}
          onClose={() => setConfirmedBookingData(null)}
        />
      )}

      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      <HostSubmissionModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
      />

      <HostDashboardModal
        isOpen={isHostDashboardOpen}
        onClose={() => setIsHostDashboardOpen(false)}
        isDarkTheme={isDarkTheme}
      />

      <SavedStaysModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedSanctuaries={savedSanctuaries}
        onRemove={toggleSave}
        onSelect={(stay) => setSelectedSanctuary(stay)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      <ReservationsModal
        isOpen={isReservationsOpen}
        onClose={() => setIsReservationsOpen(false)}
        currentUser={currentUser}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}
