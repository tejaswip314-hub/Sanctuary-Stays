'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { SEED_USERS } from '@/lib/auth/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onLogout,
}: AuthModalProps) {
  const [tab, setTab] = useState<'personas' | 'signin' | 'register'>('personas');
  const [personas, setPersonas] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('GUEST');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/personas')
      .then((res) => res.json())
      .then((data) => {
        if (data.personas) setPersonas(data.personas);
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create account');

      onSelectUser(data.session.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      onSelectUser(data.session.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-amber-500/20 text-neutral-100 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white text-lg p-2 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-amber-400/90 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
            Role-Based Authentication
          </span>
          <h2 className="text-2xl font-serif text-white mt-2">Sanctuary Account Portal</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Experience the platform from the perspective of Guests, Heritage Hosts, or Platform Curators.
          </p>
        </div>

        {/* Current Active Persona Banner */}
        {currentUser && (
          <div className="mb-6 p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-sm">
                {currentUser.name[0]}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  {currentUser.name}
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">{currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded border border-rose-500/30 hover:bg-rose-950/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 mb-6">
          <button
            onClick={() => setTab('personas')}
            className={`flex-1 pb-2.5 text-xs font-medium tracking-wide transition-colors ${
              tab === 'personas'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Instant Personas
          </button>
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 pb-2.5 text-xs font-medium tracking-wide transition-colors ${
              tab === 'signin'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 pb-2.5 text-xs font-medium tracking-wide transition-colors ${
              tab === 'register'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Tab 1: Instant Personas */}
        {tab === 'personas' && (
          <div className="space-y-3">
            <p className="text-[11px] text-neutral-400 text-center mb-2">
              Select a verified persona to test role-specific workflows and RBAC:
            </p>
            {personas.map((p) => {
              const isSelected = currentUser?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectUser(p);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/50'
                      : 'bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-700 border border-neutral-600 flex items-center justify-center font-serif font-bold text-amber-200 text-sm">
                      {p.name[0]}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                        {p.name}
                        <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-mono tracking-wider bg-neutral-700 text-amber-300">
                          {p.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400">{p.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-amber-400/90 font-medium tracking-wide">
                      {isSelected ? '✓ Active' : 'Switch →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Sign In */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@sanctuaryguest.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-neutral-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold tracking-wide transition-colors mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Tab 3: Create Account */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Radhika Sen"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-800/80 border border-neutral-700 text-neutral-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="radhika@example.in"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-800/80 border border-neutral-700 text-neutral-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="GUEST">Guest (Discover, Reserve, Review)</option>
                <option value="HOST">Heritage Host (Publish Sanctuary, Manage Bookings)</option>
                <option value="PROPERTY_MANAGER">Property Manager (Multi-Estate Management)</option>
                <option value="ADMIN">Platform Admin (Listing Quality Audit & Moderation)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold tracking-wide transition-colors mt-2"
            >
              {loading ? 'Creating...' : 'Register Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
