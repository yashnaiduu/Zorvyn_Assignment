import AuthGuard from '@/components/auth-guard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowUnauthenticated>
      <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
