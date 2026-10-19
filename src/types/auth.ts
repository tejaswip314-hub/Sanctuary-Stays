// Copyright 2026 Sanctuary Stays
// Domain: User Roles and Authentication

export type UserRole = 'GUEST' | 'HOST' | 'PROPERTY_MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  isVerified: boolean;
  verificationBadge?: 'HERITAGE_STEWARD' | 'VERIFIED_GUEST' | 'CURATOR_ADMIN';
  managedPropertyIds?: string[];
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RolePermissions {
  canBook: boolean;
  canHost: boolean;
  canManageMultipleListings: boolean;
  canAuditListings: boolean;
  canAccessFinances: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  GUEST: {
    canBook: true,
    canHost: false,
    canManageMultipleListings: false,
    canAuditListings: false,
    canAccessFinances: false,
  },
  HOST: {
    canBook: true,
    canHost: true,
    canManageMultipleListings: false,
    canAuditListings: false,
    canAccessFinances: true,
  },
  PROPERTY_MANAGER: {
    canBook: true,
    canHost: true,
    canManageMultipleListings: true,
    canAuditListings: false,
    canAccessFinances: false, // Scoped per spec FR-AUTH-004
  },
  ADMIN: {
    canBook: true,
    canHost: true,
    canManageMultipleListings: true,
    canAuditListings: true,
    canAccessFinances: true,
  },
};
