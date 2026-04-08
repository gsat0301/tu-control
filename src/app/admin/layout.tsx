import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Wallet, Users, CheckSquare, ArrowLeft } from 'lucide-react';
import { signOut } from '@/auth';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Panel Admin' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') redirect('/dashboard');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Admin sidebar */}
      <aside className="w-56 flex-shrink-0 bg-surface border-r border-surface-border flex flex-col">
        <div className="px-4 py-5 border-b border-surface-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-text-primary">
              tu<span className="text-brand-400">Control</span>
            </span>
          </Link>
          <div className="mt-2 px-1">
            <span className="badge bg-purple-500/15 text-purple-400 border-purple-500/30 text-xs">
              🛡️ Admin
            </span>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1 flex-1">
          <Link href="/admin/users" className="sidebar-link">
            <Users className="w-4 h-4" />
            Usuarios
          </Link>
          <Link href="/admin/approve" className="sidebar-link">
            <CheckSquare className="w-4 h-4" />
            Solicitudes
          </Link>
          <Link href="/dashboard" className="sidebar-link mt-4 border-t border-surface-border pt-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-surface-border text-xs text-text-muted">
          <p className="font-medium text-text-primary">{session.user.name}</p>
          <p className="text-text-muted">{session.user.email}</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
