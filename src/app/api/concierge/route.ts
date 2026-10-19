import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requestId = `CNCG-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      requestId,
      clientName: body.name,
      serviceRequested: body.serviceType,
      status: 'DISPATCHED_TO_LIAISON',
      guaranteedResponseWindowMinutes: 90,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch concierge request' },
      { status: 500 }
    );
  }
}
