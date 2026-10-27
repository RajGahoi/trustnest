import type { UserRole } from '../../types';

export type Capability = 
  | 'listing:create'
  | 'listing:edit'
  | 'listing:publish'
  | 'listing:moderate'
  | 'vendor:manage'
  | 'admin:view'
  | 'admin:system';

const ROLE_CAPABILITIES: Record<UserRole, Capability[]> = {
  GUEST: [],
  USER: ['listing:create'],
  SELLER: ['listing:create', 'listing:edit', 'listing:publish'],
  VENDOR_AGENT: ['listing:create', 'listing:edit', 'listing:publish'],
  VENDOR_ADMIN: ['listing:create', 'listing:edit', 'listing:publish', 'vendor:manage'],
  MODERATOR: ['listing:create', 'listing:edit', 'listing:publish', 'listing:moderate'],
  ADMIN: ['listing:create', 'listing:edit', 'listing:publish', 'listing:moderate', 'vendor:manage', 'admin:view', 'admin:system'],
  SUPER_ADMIN: ['listing:create', 'listing:edit', 'listing:publish', 'listing:moderate', 'vendor:manage', 'admin:view', 'admin:system'],
};

export function hasCapability(role: UserRole, capability: Capability): boolean {
  const caps = ROLE_CAPABILITIES[role] || [];
  return caps.includes(capability);
}
