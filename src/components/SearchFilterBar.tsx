'use client';

import React from 'react';
import { Search, MapPin, Building, Users, Award, RotateCcw } from 'lucide-react';
import { ArchitecturalStyle } from '../types/sanctuary';

interface SearchFilterBarProps {
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  selectedGuests: number;
  onGuestsChange: (guests: number) => void;
  minVettingScore: number;
  onVettingScoreChange: (score: number) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onReset: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  selectedLocation,
  onLocationChange,
  selectedStyle,
  onStyleChange,
  selectedGuests,
  onGuestsChange,
  minVettingScore,
  onVettingScoreChange,
  searchQuery,
  onSearchQueryChange,
  onReset,
}) => {
  const locations = [
    'All Destinations',
    'Rajasthan',
    'Goa',
    'Ladakh',
    'Kerala',
    'Uttarakhand',
    'Tamil Nadu',
    'Karnataka',
    'Puducherry',
    'Delhi',
    'Maharashtra',
    'West Bengal',
    'Japan',
    'Indonesia',
    'Italy',
    'Morocco',
    'United States',
    'Greece',
    'South Africa',
    'Switzerland',
    'New Zealand',
  ];

  const styles: (string | ArchitecturalStyle)[] = [
    'All Architectural Styles',
    'Rajputana Heritage Monolith',
    'Indo-Portuguese Modernism',
    'Himalayan Rammed Earth',
    'Kerala Vernacular',
    'Kumaon Slate Brutalism',
    'Tropical Planters Estate',
    'Shekhawati Fresco Haveli',
    'Chettinad Colonial',
    'Deccan Rock Vernacular',
    'Areca & Bamboo Organic',
    'Colonial Indo-Saracenic',
    'Vijayanagara Stone Vernacular',
    'Art Deco Coastal Modernism',
    'Lutyens Colonial Revival',
    'Madras Terrace Colonial',
    'Bengal Colonial Revival',
    'Doon Valley Estate',
    'Ganga Riverside Himalayan',
    'Japanese Machiya Modernism',
    'Balinese Bamboo Organic',
    'Tuscan Pietra Vernacular',
    'Moroccan Riad Courtyard',
    'California Cliff Modernism',
    'Cycladic Cave Vernacular',
    'Cape Dutch Colonial',
    'Swiss Alpine Chalet',
    'Southern Alps Timber Modernism',
  ];

  return (
    <div className="relative -mt-8 z-30 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/10">
        {/* Top search input */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Free text search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search by haveli, palace, architect, or unique feature (e.g. Shikara, Solar, Udaipur)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          {/* Quick Clear Button */}
          {(selectedLocation !== 'All Destinations' ||
            selectedStyle !== 'All Architectural Styles' ||
            selectedGuests > 1 ||
            minVettingScore > 0 ||
            searchQuery) && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border border-white/10 text-xs text-[#a8a194] hover:text-white hover:border-white/30 transition-all shrink-0 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Destination */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#a8a194] flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#d4af37]" />
              Region / Country
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              aria-label="Filter by destination"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc} className="bg-[#121418] text-white">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Architectural Movement */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#a8a194] flex items-center gap-1.5">
              <Building className="w-3 h-3 text-[#d4af37]" />
              Architectural Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => onStyleChange(e.target.value)}
              aria-label="Filter by architectural style"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              {styles.map((style) => (
                <option key={style} value={style} className="bg-[#121418] text-white">
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#a8a194] flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#d4af37]" />
              Capacity
            </label>
            <select
              value={selectedGuests}
              onChange={(e) => onGuestsChange(Number(e.target.value))}
              aria-label="Filter by guest capacity"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value={1} className="bg-[#121418] text-white">Any Guests (1+)</option>
              <option value={2} className="bg-[#121418] text-white">2+ Guests</option>
              <option value={4} className="bg-[#121418] text-white">4+ Guests</option>
              <option value={6} className="bg-[#121418] text-white">6+ Guests</option>
              <option value={8} className="bg-[#121418] text-white">8+ Guests</option>
            </select>
          </div>

          {/* Audit Standard Cutoff */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#a8a194] flex items-center gap-1.5">
              <Award className="w-3 h-3 text-[#d4af37]" />
              Jury Scorecard
            </label>
            <select
              value={minVettingScore}
              onChange={(e) => onVettingScoreChange(Number(e.target.value))}
              aria-label="Filter by minimum vetting score"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value={0} className="bg-[#121418] text-white">All Vetted (Top 1.8%)</option>
              <option value={99.4} className="bg-[#121418] text-white">99.4+ Distinction Tier</option>
              <option value={99.7} className="bg-[#121418] text-white">99.7+ Sovereign Tier</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
