'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearTokens, getUser } from '../utils/token';
import { getNavItems } from '../utils/rbac';
import { authService } from '../services/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  if (!user) return null;

  const navItems = getNavItems(user.role as any);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore errors on logout
    }
    clearTokens();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Zorvyn</h1>
        <p className="text-sm text-gray-400 mt-1">{user.name} ({user.role})</p>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
