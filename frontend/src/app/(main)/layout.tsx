import AuthGuard from '@/components/auth-guard';
import Sidebar from '@/components/sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto max-h-screen">
          <div className="max-w-[1280px] mx-auto px-8 py-10 lg:px-12">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
