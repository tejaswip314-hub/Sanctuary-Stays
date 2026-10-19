// Copyright 2026 Sanctuary Stays
// Domain: Booking Engine, Concurrency Lock & Server-Side Pricing Quotes

import {
  BookingStatus,
  CreateBookingRequest,
  CreateQuoteRequest,
  PriceQuote,
  Reservation,
} from '@/types/booking';
import { SANCTUARIES } from '@/data/sanctuaries';

// In-memory data structures for concurrent booking holds and reservations
const bookingsStore = new Map<string, Reservation>();
const idempotencyStore = new Map<string, Reservation>();
const quotesStore = new Map<string, PriceQuote>();

// Helper: parse date to midnight UTC timestamp
function parseDateToTimestamp(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getTime();
}

// Clean up expired holds
function sweepExpiredHolds(): void {
  const now = Date.now();
  for (const [id, res] of bookingsStore.entries()) {
    if (res.status === 'HELD' && res.heldUntil) {
      if (new Date(res.heldUntil).getTime() < now) {
        res.status = 'EXPIRED';
        res.updatedAt = new Date().toISOString();
      }
    }
  }
}

// Check if overlapping dates exist for this sanctuary
export function checkAvailability(
  sanctuaryId: string,
  checkInStr: string,
  checkOutStr: string,
  excludeBookingId?: string
): { isAvailable: boolean; conflictReason?: string } {
  sweepExpiredHolds();

  const requestedStart = parseDateToTimestamp(checkInStr);
  const requestedEnd = parseDateToTimestamp(checkOutStr);

  if (isNaN(requestedStart) || isNaN(requestedEnd) || requestedEnd <= requestedStart) {
    return { isAvailable: false, conflictReason: 'Check-out date must be after check-in date.' };
  }

  for (const res of bookingsStore.values()) {
    if (res.sanctuaryId !== sanctuaryId) continue;
    if (excludeBookingId && res.id === excludeBookingId) continue;
    if (res.status !== 'CONFIRMED' && res.status !== 'HELD') continue;

    const existingStart = parseDateToTimestamp(res.checkIn);
    const existingEnd = parseDateToTimestamp(res.checkOut);

    // Overlap condition: requestedStart < existingEnd && requestedEnd > existingStart
    if (requestedStart < existingEnd && requestedEnd > existingStart) {
      const stateLabel = res.status === 'HELD' ? 'temporarily held by another guest' : 'already confirmed';
      return {
        isAvailable: false,
        conflictReason: `These dates are ${stateLabel} until ${res.checkOut}. Please select alternative dates.`,
      };
    }
  }

  return { isAvailable: true };
}

// Authoritative quote generator (FR-PRICE-001 through FR-PRICE-008)
export function calculateQuote(params: CreateQuoteRequest): PriceQuote {
  const sanctuary = SANCTUARIES.find((s) => s.id === params.sanctuaryId);
  if (!sanctuary) {
    throw new Error(`Sanctuary '${params.sanctuaryId}' not found.`);
  }

  const startMs = parseDateToTimestamp(params.checkIn);
  const endMs = parseDateToTimestamp(params.checkOut);

  if (isNaN(startMs) || isNaN(endMs) || endMs <= startMs) {
    throw new Error('Check-out date must be strictly after check-in date.');
  }

  const nights = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));
  const nightlyRate = sanctuary.nightlyPrice;
  const baseStayAmount = nightlyRate * nights;

  // Mandatory Cleaning & Turnkey Inspection Fee
  const cleaningFee = 4500;

  // 5% Architectural Preservation & Curatorial Heritage Liaison Fund
  const preservationFee = Math.round(baseStayAmount * 0.05);

  // Addons Total
  const addonsTotal = (params.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);

  // 18% GST (India Standard Hospitality GST)
  const taxableBase = baseStayAmount + cleaningFee + preservationFee + addonsTotal;
  const taxesGst = Math.round(taxableBase * 0.18);

  const grandTotal = taxableBase + taxesGst;

  const quoteId = `quo_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15-minute validity

  const quote: PriceQuote = {
    quoteId,
    sanctuaryId: sanctuary.id,
    sanctuaryTitle: sanctuary.title,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    nights,
    guests: params.guests,
    nightlyRate,
    baseStayAmount,
    cleaningFee,
    preservationFee,
    taxesGst,
    addonsTotal,
    grandTotal,
    currency: 'INR',
    breakdown: [
      {
        label: `₹${nightlyRate.toLocaleString('en-IN')} × ${nights} nights`,
        amount: baseStayAmount,
        isMandatory: true,
      },
      {
        label: 'Zero-Chore Turnkey Departure & Cleaning Fee',
        amount: cleaningFee,
        description: 'Complete departure housekeeping with zero chores required from guests.',
        isMandatory: true,
      },
      {
        label: 'Architectural Preservation & Concierge Fund (5%)',
        amount: preservationFee,
        description: 'Direct contribution to master craftsman restoration and private liaison coverage.',
        isMandatory: true,
      },
      {
        label: 'Goods & Services Tax (18% GST)',
        amount: taxesGst,
        description: 'Mandatory statutory hospitality tax.',
        isMandatory: true,
      },
      ...(params.addons || []).map((addon) => ({
        label: addon.name,
        amount: addon.price,
        isMandatory: false,
      })),
    ],
    expiresAt,
    policyVersion: '2026.1-sanctuary-india',
  };

  quotesStore.set(quoteId, quote);
  return quote;
}

// Create hold or confirm reservation with concurrency lock & idempotency
export function processReservation(params: CreateBookingRequest): Reservation {
  sweepExpiredHolds();

  // 1. Idempotency check: return existing if key matches
  if (params.idempotencyKey && idempotencyStore.has(params.idempotencyKey)) {
    return idempotencyStore.get(params.idempotencyKey)!;
  }

  // 2. Validate availability
  const avail = checkAvailability(params.sanctuaryId, params.checkIn, params.checkOut);
  if (!avail.isAvailable) {
    const error = new Error(avail.conflictReason || 'Inventory is not available for requested dates.') as Error & {
      statusCode: number;
    };
    error.statusCode = 409;
    throw error;
  }

  // 3. Resolve or recalculate quote
  let quote = params.quoteId ? quotesStore.get(params.quoteId) : undefined;
  if (!quote || new Date(quote.expiresAt).getTime() < Date.now()) {
    quote = calculateQuote({
      sanctuaryId: params.sanctuaryId,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: params.guests,
      addons: params.addons,
    });
  }

  const sanctuary = SANCTUARIES.find((s) => s.id === params.sanctuaryId);
  const now = new Date().toISOString();
  const bookingId = `res_${Math.random().toString(36).substring(2, 9)}`;
  const referenceCode = `SNC-${Math.floor(100000 + Math.random() * 900000)}`;

  const isHold = params.action === 'HOLD';
  const heldUntil = isHold ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : undefined;

  const reservation: Reservation = {
    id: bookingId,
    referenceCode,
    sanctuaryId: params.sanctuaryId,
    sanctuaryTitle: quote.sanctuaryTitle,
    sanctuaryLocation: sanctuary
      ? `${sanctuary.location.city}, ${sanctuary.location.state}, ${sanctuary.location.country}`
      : 'World',
    guestId: params.guestId || 'usr_guest_01',
    guestName: params.guestName || 'Aarav Sharma',
    guestEmail: params.guestEmail || 'guest@sanctuarycollective.in',
    hostId: 'usr_host_01',
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    nights: quote.nights,
    guests: params.guests,
    status: isHold ? 'HELD' : 'CONFIRMED',
    paymentStatus: isHold ? 'AUTHORIZED' : 'SUCCEEDED',
    quote,
    idempotencyKey: params.idempotencyKey,
    heldUntil,
    confirmedAt: isHold ? undefined : now,
    assignedLiaison: {
      name: sanctuary?.curatorName || 'Devraj Chauhan',
      title: 'Lead Global Heritage Stay Liaison',
      contact: 'liaison@sanctuarycollective.in',
    },
    choreGuarantee: 'Zero-Chore Turnkey Departure Guaranteed',
    createdAt: now,
    updatedAt: now,
  };

  bookingsStore.set(bookingId, reservation);
  if (params.idempotencyKey) {
    idempotencyStore.set(params.idempotencyKey, reservation);
  }

  return reservation;
}

// Confirm an existing hold
export function confirmHoldReservation(bookingId: string): Reservation {
  sweepExpiredHolds();
  const reservation = bookingsStore.get(bookingId);
  if (!reservation) throw new Error('Reservation not found.');

  if (reservation.status === 'EXPIRED') {
    throw new Error('Hold reservation has expired. Please recalculate your stay.');
  }

  reservation.status = 'CONFIRMED';
  reservation.paymentStatus = 'SUCCEEDED';
  reservation.confirmedAt = new Date().toISOString();
  reservation.heldUntil = undefined;
  reservation.updatedAt = new Date().toISOString();

  return reservation;
}

// Cancel reservation and calculate refund
export function cancelReservation(
  bookingId: string,
  cancelledBy: 'GUEST' | 'HOST',
  reason?: string
): Reservation {
  const reservation = bookingsStore.get(bookingId);
  if (!reservation) throw new Error('Reservation not found.');

  if (reservation.status === 'CANCELLED_BY_GUEST' || reservation.status === 'CANCELLED_BY_HOST') {
    return reservation;
  }

  const now = Date.now();
  const checkInMs = parseDateToTimestamp(reservation.checkIn);
  const hoursUntilCheckIn = (checkInMs - now) / (1000 * 60 * 60);

  // Refund policy:
  // If cancelled by Host: 100% refund
  // If cancelled by Guest > 7 days (168 hours): 100% refund
  // If cancelled by Guest > 48 hours: 50% refund
  // If cancelled < 48 hours: 0% refund (cleaning fee refunded)
  let refund = 0;
  if (cancelledBy === 'HOST' || hoursUntilCheckIn >= 168) {
    refund = reservation.quote.grandTotal;
  } else if (hoursUntilCheckIn >= 48) {
    refund = Math.round(reservation.quote.grandTotal * 0.5);
  } else {
    refund = reservation.quote.cleaningFee;
  }

  reservation.status = cancelledBy === 'HOST' ? 'CANCELLED_BY_HOST' : 'CANCELLED_BY_GUEST';
  reservation.paymentStatus = refund > 0 ? 'REFUNDED' : reservation.paymentStatus;
  reservation.cancelledAt = new Date().toISOString();
  reservation.cancellationReason = reason || 'Guest requested cancellation';
  reservation.refundAmount = refund;
  reservation.updatedAt = new Date().toISOString();

  return reservation;
}

// Query reservations by user or host
export function getReservationsForUser(userId: string, role: string): Reservation[] {
  sweepExpiredHolds();
  const list = Array.from(bookingsStore.values());

  if (role === 'ADMIN') return list;
  if (role === 'HOST' || role === 'PROPERTY_MANAGER') {
    // Return all bookings for host estates or demo bookings
    return list;
  }
  return list.filter((r) => r.guestId === userId || r.guestEmail.includes(userId));
}

// Seed an initial demo booking for instant visible history
try {
  processReservation({
    idempotencyKey: 'demo-seed-key-001',
    quoteId: '',
    sanctuaryId: 'sanctuary-in-01',
    guestId: 'usr_guest_01',
    guestName: 'Aarav Sharma',
    guestEmail: 'aarav@sanctuaryguest.in',
    checkIn: '2026-11-10',
    checkOut: '2026-11-14',
    guests: 2,
    action: 'CONFIRM',
  });
} catch (e) {
  // Silently ignore during build compilation if data isn't initialized yet
}
