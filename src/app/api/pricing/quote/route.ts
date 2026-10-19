import { NextResponse } from 'next/server';
import { calculateQuote } from '@/lib/bookings/engine';
import { CreateQuoteRequest } from '@/types/booking';

export async function POST(request: Request) {
  try {
    const body: CreateQuoteRequest = await request.json();

    if (!body.sanctuaryId || !body.checkIn || !body.checkOut) {
      return NextResponse.json(
        { success: false, error: 'sanctuaryId, checkIn, and checkOut are required.' },
        { status: 400 }
      );
    }

    const quote = calculateQuote(body);
    return NextResponse.json({ success: true, quote });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to calculate quote.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
