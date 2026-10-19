import { NextResponse } from 'next/server';
import { SEED_USERS } from '@/lib/auth/store';

export async function GET() {
  return NextResponse.json({
    success: true,
    personas: SEED_USERS,
  });
}
