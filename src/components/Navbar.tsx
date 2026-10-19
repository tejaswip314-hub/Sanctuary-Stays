'use client';

import React from 'react';
import {
  Compass,
  Heart,
  Sparkles,
  Home,
  ShieldCheck,
  Sun,
  Moon,
  LayoutDashboard,
  CalendarDays,
  User as UserIcon,
} from 'lucide-react';
import { User } from '@/types/auth';

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenConcierge: () => void;
  onOpenSubmit: () => void;
  onOpenHostDashboard: () => void;
  onOpenReservations: () => void;
  onOpenAuth: () => void;
  currentUser: User | null;
  onScrollToStandard: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenSaved,
  onOpenConcierge,
  onOpenSubmit,
  onOpenHostDashboard,
  onOpenReservations,
  onOpenAuth,
  currentUser,
  onScrollToStandard,
  isDarkTheme,
  onToggleTheme,
}) => {
  const isHostOrAdmin = currentUser?.role === 'HOST' || currentUser?.role === 'PROPERTY_MANAGER' || currentUser?.role === 'ADMIN';

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all ${
        isDarkTheme
          ? 'border-white/10 bg-[#0b0c0e]/85'
          : 'border-black/10 bg-[#fbf9f5]/85'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-white/5 transition-transform group-hover:scale-105">
              <span className="font-editorial text-lg tracking-widest text-[#d4af37]">S</span>
            </div>
            <div>
              <div
                className={`font-editorial text-xl tracking-[0.25em] uppercase font-semibold transition-colors ${
                  isDarkTheme ? 'text-white' : 'text-stone-900'
                }`}
              >
                Sanctuary
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#a39e93] font-light">
                Curated Architecture & Stays
              </div>
            </div>
          </div>

          {/* Desktop Editorial Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-widest">
            <button
              onClick={onScrollToStandard}
              className="flex items-center space-x-1.5 text-[#a8a194] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>The Standard</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('sanctuaries-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-1.5 text-[#a8a194] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Collection</span>
            </button>
            <button
              onClick={onOpenReservations}
              className="flex items-center space-x-1.5 text-[#a8a194] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>My Reservations</span>
            </button>
            {isHostOrAdmin && (
              <button
                onClick={onOpenHostDashboard}
                className="flex items-center space-x-1.5 text-[#d4af37] hover:text-[#e4c256] transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Proprietor Portal</span>
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* User Persona / Auth Pill */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                currentUser
                  ? 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-white'
                  : 'border-white/15 bg-white/5 hover:border-amber-400 text-neutral-300 hover:text-white'
              }`}
              title="Click to switch persona or view account roles"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center text-[10px] font-bold text-amber-300">
                {currentUser ? currentUser.name[0] : <UserIcon className="w-3 h-3" />}
              </div>
              <span className="hidden sm:inline font-medium text-[11px]">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
              {currentUser && (
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {currentUser.role}
                </span>
              )}
            </button>

            {/* Theme Toggle (Dark Obsidian vs Warm Editorial Linen) */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              title={isDarkTheme ? 'Switch to Warm Editorial Linen Theme' : 'Switch to Midnight Obsidian Theme'}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDarkTheme
                  ? 'border-white/10 hover:border-[#d4af37] bg-white/5 text-white/80 hover:text-white'
                  : 'border-black/10 hover:border-[#b38947] bg-black/5 text-stone-700 hover:text-stone-900'
              }`}
            >
              {isDarkTheme ? (
                <Sun className="w-3.5 h-3.5 text-[#d4af37]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#b38947]" />
              )}
            </button>

            {/* Wishlist / Saved Stays */}
            <button
              onClick={onOpenSaved}
              className={`relative p-2 rounded-full border transition-all cursor-pointer ${
                isDarkTheme
                  ? 'border-white/10 hover:border-[#d4af37]/50 text-white/80 hover:text-white bg-white/5'
                  : 'border-black/10 hover:border-[#b38947]/50 text-stone-700 hover:text-stone-900 bg-black/5'
              }`}
              title="Saved Curations"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  savedCount > 0 ? 'text-[#d4af37] fill-[#d4af37]' : ''
                }`}
              />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Submit Property for Curation CTA */}
            <button
              onClick={onOpenSubmit}
              className={`hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[11px] tracking-wider uppercase transition-all cursor-pointer ${
                isDarkTheme
                  ? 'border-white/15 text-[#ede8df] hover:border-[#d4af37] hover:text-[#d4af37] bg-white/[0.03]'
                  : 'border-black/15 text-stone-800 hover:border-[#b38947] hover:text-[#b38947] bg-black/[0.03]'
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Submit Stay</span>
            </button>

            {/* Concierge Button */}
            <button
              onClick={onOpenConcierge}
              className="px-3.5 py-1.5 rounded-full bg-[#d4af37] hover:bg-[#e4c256] text-black text-[11px] font-semibold tracking-wider uppercase transition-all shadow-md shadow-[#d4af37]/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Concierge
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
