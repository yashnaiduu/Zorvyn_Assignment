'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken, getUser } from '../utils/token';
import { hasPermission } from '../utils/rbac';

export default function AuthGuard({ children, allowUnauthenticated = false }: { children: React.ReactNode, allowUnauthenticated?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const user = getUser();
    
    authCheck(token, user);
  }, [pathname]);

  function authCheck(token: string | null, user: any) {
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

    // Role check logic based on route
    if (pathname.startsWith('/records') && !hasPermission(user.role, 'record:read')) {
      router.push('/dashboard');
      return;
    }
    
    if (pathname.startsWith('/analytics') && !hasPermission(user.role, 'analytics:read')) {
      router.push('/dashboard');
      return;
    }

    setAuthorized(true);
  }

  if (!authorized && !allowUnauthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Could be a loading spinner
  }

  return <>{children}</>;
}
