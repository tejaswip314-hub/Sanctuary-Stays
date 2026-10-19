// Copyright 2026 Sanctuary Stays
// Domain: Booking Lifecycle, Pricing Quotes & Concurrency Protection

export type BookingStatus =
  | 'INITIATED'
  | 'HELD'
  | 'PENDING_HOST'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED_BY_GUEST'
  | 'CANCELLED_BY_HOST'
  | 'COMPLETED'
  | 'DISPUTED';

export type PaymentStatus =
  | 'CREATED'
  | 'REQUIRES_ACTION'
  | 'PROCESSING'
  | 'AUTHORIZED'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'REFUNDED';

export interface PriceBreakdownItem {
  label: string;
  amount: number;
  description?: string;
  isMandatory: boolean;
}

export interface PriceQuote {
  quoteId: string;
  sanctuaryId: string;
  sanctuaryTitle: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guests: number;
  nightlyRate: number;
  baseStayAmount: number;
  cleaningFee: number;
  preservationFee: number; // 5% Architectural preservation & concierge fund
  taxesGst: number; // 18% GST (India standard hospitality)
  addonsTotal: number;
  grandTotal: number;
  currency: 'INR';
  breakdown: PriceBreakdownItem[];
  expiresAt: string; // 15-minute validity
  policyVersion: string;
}

export interface Reservation {
  id: string;
  referenceCode: string; // SNC-XXXXXX
  sanctuaryId: string;
  sanctuaryTitle: string;
  sanctuaryLocation: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  hostId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  quote: PriceQuote;
  idempotencyKey: string;
  heldUntil?: string; // ISO 8601
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  refundAmount?: number;
  assignedLiaison: {
    name: string;
    title: string;
    contact: string;
  };
  choreGuarantee: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteRequest {
  sanctuaryId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  addons?: { name: string; price: number }[];
}

export interface CreateBookingRequest {
  idempotencyKey: string;
  quoteId: string;
  sanctuaryId: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  addons?: { name: string; price: number }[];
  action: 'HOLD' | 'CONFIRM';
}

export interface CancelBookingRequest {
  cancelledBy: 'GUEST' | 'HOST';
  reason?: string;
}
