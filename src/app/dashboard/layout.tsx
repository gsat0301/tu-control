import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userRole={session.user.role}
        userName={session.user.name ?? 'Usuario'}
        userEmail={session.user.email ?? ''}
        isPremium={session.user.isPremium}
      />

      {/* Main content area */}
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 glass border-b border-surface-border">
          <div className="px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="lg:hidden w-10" /> {/* spacer for mobile menu button */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow" />
              Conectado
            </div>
            <div className="flex items-center gap-3">
              {!session.user.isPremium && (
                <span className="hidden sm:flex text-xs text-text-muted">
                  <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer"
                    className="text-brand-400 hover:text-brand-300 transition-colors">
                    ☕ Eliminar anuncios
                  </a>
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                  <span className="text-xs font-semibold text-brand-400">
                    {(session.user.name ?? 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm text-text-secondary">
                  {session.user.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>

        {/* AdSense Banner - only if not premium */}
        {!session.user.isPremium && (
          <div className="mx-6 lg:mx-8 mb-6 p-3 border border-surface-border rounded-xl text-center text-xs text-text-muted bg-surface-card/50">
            {/* Google AdSense se integra aquí */}
            <span className="opacity-50">Publicidad — Dona para eliminar</span>
          </div>
        )}
      </main>
    </div>
  );
}
