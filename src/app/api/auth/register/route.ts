import { NextResponse } from 'next/server';
import { createUser } from '@/lib/auth/store';
import { RegisterRequest } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    const session = createUser(body);
    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to register account.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
