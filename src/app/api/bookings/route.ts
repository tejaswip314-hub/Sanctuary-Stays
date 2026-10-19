import { NextResponse } from 'next/server';
import { processReservation, getReservationsForUser } from '@/lib/bookings/engine';
import { CreateBookingRequest } from '@/types/booking';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'usr_guest_01';
  const role = searchParams.get('role') || 'GUEST';

  const reservations = getReservationsForUser(userId, role);
  return NextResponse.json({ success: true, reservations });
}

export async function POST(request: Request) {
  try {
    const body: CreateBookingRequest = await request.json();

    if (!body.sanctuaryId || !body.checkIn || !body.checkOut) {
      return NextResponse.json(
        { success: false, error: 'sanctuaryId, checkIn, and checkOut are mandatory.' },
        { status: 400 }
      );
    }

    const reservation = processReservation(body);
    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string };
    const status = err.statusCode || 400;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process reservation' },
      { status }
    );
  }
}
