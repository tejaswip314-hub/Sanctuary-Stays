import { NextResponse } from 'next/server';
import { cancelReservation } from '@/lib/bookings/engine';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cancelledBy = body.cancelledBy || 'GUEST';
    const reason = body.reason;

    const updatedReservation = cancelReservation(id, cancelledBy, reason);
    return NextResponse.json({ success: true, reservation: updatedReservation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to cancel reservation';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
