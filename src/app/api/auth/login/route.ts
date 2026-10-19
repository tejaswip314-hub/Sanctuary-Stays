import { NextResponse } from 'next/server';
import { findUserByEmail, createSessionForUser } from '@/lib/auth/store';
import { LoginRequest } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(body.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Account not found with this email.' },
        { status: 404 }
      );
    }

    const session = createSessionForUser(user);
    return NextResponse.json({ success: true, session });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
