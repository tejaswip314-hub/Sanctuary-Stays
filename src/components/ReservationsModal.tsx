'use client';

import React, { useState, useEffect } from 'react';
import { Reservation } from '@/types/booking';
import { User } from '@/types/auth';
import { Calendar, ShieldCheck, Clock, Ban, CheckCircle2, RefreshCw } from 'lucide-react';

interface ReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  isDarkTheme: boolean;
}

export default function ReservationsModal({
  isOpen,
  onClose,
  currentUser,
  isDarkTheme,
}: ReservationsModalProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/bookings?userId=${encodeURIComponent(currentUser.id)}&role=${encodeURIComponent(
          currentUser.role
        )}`
      );
      const data = await res.json();
      if (data.reservations) {
        setReservations(data.reservations);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    let ignore = false;
    queueMicrotask(() => {
      if (!ignore) fetchReservations();
    });
    return () => {
      ignore = true;
    };
  }, [isOpen, currentUser]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    setCancelMessage(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancelledBy: currentUser?.role === 'HOST' ? 'HOST' : 'GUEST',
          reason: 'Schedule change requested by user',
        }),
      });
      const data = await res.json();
      if (data.reservation) {
        setCancelMessage(
          `Reservation cancelled. Refund processed: ₹${(
            data.reservation.refundAmount || 0
          ).toLocaleString('en-IN')}`
        );
        fetchReservations();
      }
    } catch {
      setCancelMessage('Failed to cancel reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 ${
          isDarkTheme ? 'bg-[#0f1115] border-white/10 text-white' : 'bg-[#faf7f2] border-black/10 text-stone-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Authoritative Lifecycle
              </span>
              <span className="text-xs text-neutral-400">
                {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Guest'}
              </span>
            </div>
            <h2 className="text-2xl font-serif mt-1">My Sanctuary Reservations</h2>
          </div>

          <button
            onClick={fetchReservations}
            disabled={loading}
            className="p-2 rounded-full border border-white/10 hover:border-amber-400 text-neutral-300 hover:text-amber-400 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {cancelMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs">
            {cancelMessage}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {reservations.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 space-y-3">
              <Calendar className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="text-sm">No active reservations found.</p>
              <p className="text-xs text-neutral-500">
                Explore the curated collection and reserve your architectural sanctuary.
              </p>
            </div>
          ) : (
            reservations.map((res) => {
              const isHeld = res.status === 'HELD';
              const isConfirmed = res.status === 'CONFIRMED';
              const isCancelled = res.status.includes('CANCELLED');

              return (
                <div
                  key={res.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDarkTheme ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-semibold tracking-wider">
                          {res.referenceCode}
                        </span>
                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-semibold border ${
                            isConfirmed
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : isHeld
                              ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                              : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-semibold mt-1">{res.sanctuaryTitle}</h4>
                      <div className="text-xs text-neutral-400 mt-0.5">{res.sanctuaryLocation}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-amber-400">
                        ₹{res.quote.grandTotal.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-neutral-400">Total Charged (INR)</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Check-in</span>
                      <span className="font-medium text-neutral-200">{res.checkIn}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Check-out</span>
                      <span className="font-medium text-neutral-200">{res.checkOut}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Guests & Nights</span>
                      <span className="font-medium text-neutral-200">
                        {res.guests} Guests • {res.nights} Nights
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Heritage Liaison</span>
                      <span className="font-medium text-amber-300">{res.assignedLiaison.name}</span>
                    </div>
                  </div>

                  {/* Actions & Policy */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Zero-Chore Turnkey Departure Included
                    </span>

                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelBooking(res.id)}
                        disabled={cancellingId === res.id}
                        className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-950/30 transition-colors"
                      >
                        {cancellingId === res.id ? 'Processing...' : 'Cancel Stay'}
                      </button>
                    )}

                    {isCancelled && res.refundAmount !== undefined && (
                      <span className="text-xs text-rose-300">
                        Cancelled (Refund: ₹{res.refundAmount.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
