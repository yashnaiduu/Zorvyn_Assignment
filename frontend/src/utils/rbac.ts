type Role = 'VIEWER' | 'ANALYST' | 'ADMIN';

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ['record:create', 'record:read', 'record:update', 'record:delete', 'user:manage', 'analytics:read'],
  ANALYST: ['record:read', 'analytics:read'],
  VIEWER: ['analytics:read'],
};

export function hasPermission(role: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

interface NavItem {
  label: string;
  href: string;
  permission?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Records', href: '/records', permission: 'record:read' },
  { label: 'Analytics', href: '/analytics', permission: 'analytics:read' },
];

export function getNavItems(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.permission || hasPermission(role, item.permission));
}
