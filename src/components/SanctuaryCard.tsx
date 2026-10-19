'use client';

import React, { useState } from 'react';
import { SanctuaryStay } from '../types/sanctuary';
import { Heart, ChevronLeft, ChevronRight, VolumeX, Sparkles, Star, Users, CheckCircle, Moon } from 'lucide-react';

interface SanctuaryCardProps {
  sanctuary: SanctuaryStay;
  isSaved: boolean;
  onToggleSaved: (id: string) => void;
  onSelect: (sanctuary: SanctuaryStay) => void;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
  isDarkTheme?: boolean;
}

export const SanctuaryCard: React.FC<SanctuaryCardProps> = ({
  sanctuary,
  isSaved,
  onToggleSaved,
  onSelect,
  isHovered = false,
  onHover,
  isDarkTheme = true,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % sanctuary.galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? sanctuary.galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <div
      onClick={() => onSelect(sanctuary)}
      onMouseEnter={() => onHover && onHover(sanctuary.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${
        isHovered
          ? 'border-[#d4af37] ring-1 ring-[#d4af37] shadow-xl shadow-[#d4af37]/20 scale-[1.01]'
          : isDarkTheme
          ? 'bg-[#121418] border-white/10 hover:border-[#d4af37]/40 hover:shadow-black/60'
          : 'bg-white border-black/10 hover:border-[#b38947]/50 hover:shadow-stone-300'
      }`}
    >
      {/* Image Gallery Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
        <img
          src={sanctuary.galleryImages[currentImageIndex] || sanctuary.coverImage}
          alt={sanctuary.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Dark Gradient Overlay for Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Audit Score Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-[#f4efe6]">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span className="font-editorial text-[#d4af37] font-semibold">
              {sanctuary.vettingAudit.overallScore.toFixed(1)}
            </span>
            <span className="text-white/60">/ 100</span>
          </div>

          {/* Save / Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved(sanctuary.id);
            }}
            aria-label="Save to curated list"
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 hover:border-[#d4af37] text-white/90 hover:text-white transition-all transform active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'text-[#d4af37] fill-[#d4af37]' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Carousel Navigation Arrows */}
        {sanctuary.galleryImages.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white border border-white/10 hover:border-white/40 transition-transform active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white border border-white/10 hover:border-white/40 transition-transform active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex space-x-1">
              {sanctuary.galleryImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-[#d4af37] w-3' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Architectural Style Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] tracking-wider uppercase text-[#d4af37] font-medium">
            {sanctuary.architecturalStyle}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-[#a8a194] mb-1.5">
            <span>
              {sanctuary.location.city}, {sanctuary.location.state}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
              <span className="font-medium">{sanctuary.rating.toFixed(2)}</span>
              <span className="opacity-50">({sanctuary.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-editorial text-lg font-medium group-hover:text-[#d4af37] transition-colors leading-snug">
            {sanctuary.title}
          </h2>

          {/* Tagline / Subtitle */}
          <p className="mt-1 text-xs text-[#9d9588] line-clamp-2 leading-relaxed">
            {sanctuary.subtitle}
          </p>

          {/* Vetted Quality & Vibe Badges */}
          <div className="mt-3.5 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-[#cfc9be]">
            <div className="flex items-center space-x-1.5" title="Acoustically Audited Interior">
              <VolumeX className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="truncate">{sanctuary.vettingAudit.acousticLevelDb} dB Quiet</span>
            </div>
            <div className="flex items-center space-x-1.5" title="Dark Sky Rating">
              <Moon className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="truncate">Dark Sky Bortle {sanctuary.neighborhoodVibe.darkSkyClass.slice(13, 14) || '1'}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Chore-Free Guarantee Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-end justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="font-editorial text-xl font-semibold">
                ₹{sanctuary.nightlyPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#a8a194]">/ night</span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-[#bfa07a] mt-0.5">
              <CheckCircle className="w-3 h-3" />
              <span>Zero-chore departure</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(sanctuary)}
            className="px-3.5 py-1.5 rounded-lg border border-[#d4af37]/40 text-xs uppercase tracking-wider text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all font-medium"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};
