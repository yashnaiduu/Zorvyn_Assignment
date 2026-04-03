'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth';
import { setTokens } from '@/utils/token';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login({ email, password });
      setTokens(res.data.access_token, res.data.refresh_token, res.data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-[34px] font-semibold tracking-tight leading-tight" style={{ color: 'var(--text)' }}>
          Sign in
        </h1>
        <p className="text-[15px] mt-2" style={{ color: 'var(--text-secondary)' }}>
          Access your Zorvyn account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <p className="text-[13px] text-center py-3 rounded-xl" style={{ color: 'var(--danger)', background: 'var(--bg-secondary)' }}>
            {error}
          </p>
        )}

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
          <input type="password" required placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-[15px] font-medium text-white transition-opacity disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          New to Zorvyn?{' '}
          <Link href="/register" style={{ color: 'var(--accent)' }}>Create account</Link>
        </p>
      </form>
    </>
  );
}
