'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken, getUser } from '../utils/token';
import { hasPermission } from '../utils/rbac';

export default function AuthGuard({ children, allowUnauthenticated = false }: { children: React.ReactNode; allowUnauthenticated?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const user = getUser();

    if (allowUnauthenticated) {
      if (token && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
      } else {
        setAuthorized(true);
      }
      return;
    }

    if (!token || !user) {
      setAuthorized(false);
      router.push('/login');
      return;
    }

    if (pathname.startsWith('/records') && !hasPermission(user.role, 'record:read')) {
      router.push('/dashboard');
      return;
    }

    if (pathname.startsWith('/analytics') && !hasPermission(user.role, 'analytics:read')) {
      router.push('/dashboard');
      return;
    }

    setAuthorized(true);
  }, [pathname, router, allowUnauthenticated]);

  if (!authorized && !allowUnauthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
