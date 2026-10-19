// Copyright 2026 Sanctuary Stays
// Domain: Auth Service & Seed Personas

import { User, UserRole, AuthSession, RegisterRequest } from '@/types/auth';

export const SEED_USERS: User[] = [
  {
    id: 'usr_guest_01',
    name: 'Aarav Sharma',
    email: 'aarav@sanctuaryguest.in',
    role: 'GUEST',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98201 12345',
    isVerified: true,
    verificationBadge: 'VERIFIED_GUEST',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr_host_01',
    name: 'Princess Gayatri Devi',
    email: 'gayatri@udaipur-sanctuary.in',
    role: 'HOST',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98290 87654',
    isVerified: true,
    verificationBadge: 'HERITAGE_STEWARD',
    managedPropertyIds: ['sanctuary-in-01', 'sanctuary-in-03'],
    createdAt: '2025-11-20T08:30:00Z',
  },
  {
    id: 'usr_pm_01',
    name: 'Vikramaditya Rao',
    email: 'vikram@rajasthan-estates.in',
    role: 'PROPERTY_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+91 94140 55678',
    isVerified: true,
    verificationBadge: 'HERITAGE_STEWARD',
    managedPropertyIds: ['sanctuary-in-01', 'sanctuary-in-02', 'sanctuary-in-03', 'sanctuary-in-04'],
    createdAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'usr_admin_01',
    name: 'Meera Iyer',
    email: 'meera.admin@sanctuarycollective.in',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98110 99887',
    isVerified: true,
    verificationBadge: 'CURATOR_ADMIN',
    createdAt: '2025-10-01T00:00:00Z',
  },
];

// In-memory runtime user store (persisted in module scope on server)
const usersStore = new Map<string, User>(SEED_USERS.map((u) => [u.email.toLowerCase(), u]));

export function findUserByEmail(email: string): User | undefined {
  return usersStore.get(email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  for (const user of usersStore.values()) {
    if (user.id === id) return user;
  }
  return undefined;
}

export function createUser(data: RegisterRequest): AuthSession {
  const existing = findUserByEmail(data.email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: User = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role || 'GUEST',
    phone: data.phone || '+91 98000 00000',
    isVerified: true,
    verificationBadge: data.role === 'HOST' ? 'HERITAGE_STEWARD' : 'VERIFIED_GUEST',
    createdAt: new Date().toISOString(),
  };

  usersStore.set(newUser.email, newUser);

  return {
    user: newUser,
    token: `snc_jwt_${Buffer.from(newUser.id).toString('base64')}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function createSessionForUser(user: User): AuthSession {
  return {
    user,
    token: `snc_jwt_${Buffer.from(user.id).toString('base64')}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function updateUserProfile(id: string, updates: Partial<User>): User {
  const user = findUserById(id);
  if (!user) throw new Error('User not found.');

  const updated: User = { ...user, ...updates, id: user.id };
  usersStore.set(user.email, updated);
  return updated;
}
