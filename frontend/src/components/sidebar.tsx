'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearTokens, getUser } from '../utils/token';
import { getNavItems } from '../utils/rbac';
import { authService } from '../services/auth';
import { useTheme } from '../utils/theme';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const { theme, toggle } = useTheme();

  if (!user) return null;

  const navItems = getNavItems(user.role as 'VIEWER' | 'ANALYST' | 'ADMIN');

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    clearTokens();
    router.push('/login');
  };

  return (
    <aside
      className="w-[240px] flex flex-col min-h-screen border-r shrink-0"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', transition: 'background 200ms ease' }}
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <h1 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--text)' }}>Zorvyn</h1>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Finance</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2.5 rounded-lg text-[14px] transition-colors"
                  style={{
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--text)' : 'var(--text-secondary)',
                    background: active ? 'var(--bg)' : 'transparent',
                    boxShadow: active ? 'var(--card-shadow)' : 'none',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        {/* User */}
        <div className="px-2">
          <p className="text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>{user.name}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{user.role}</p>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-full px-3 py-2 rounded-lg text-[13px] text-left transition-colors"
          style={{ color: 'var(--text-secondary)', background: 'transparent' }}
        >
          {theme === 'light' ? '◑ Dark mode' : '◐ Light mode'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg text-[13px] text-left transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
