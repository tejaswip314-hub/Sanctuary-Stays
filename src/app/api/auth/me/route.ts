import { NextResponse } from 'next/server';
import { findUserById, updateUserProfile } from '@/lib/auth/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  const user = findUserById(userId);
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json(
        { success: false, error: 'userId and updates are required' },
        { status: 400 }
      );
    }

    const updated = updateUserProfile(userId, updates);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
