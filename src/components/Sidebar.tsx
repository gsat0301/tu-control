'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  PiggyBank,
  FileDown,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Portfolio {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface SidebarProps {
  userRole: string;
  userName: string;
  userEmail: string;
  isPremium: boolean;
}

const mainNavLinks = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/transactions', label: 'Transacciones', icon: CreditCard },
  { href: '/dashboard/savings', label: 'Ahorros', icon: PiggyBank },
  { href: '/dashboard/reports', label: 'Reportes', icon: FileDown },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar({ userRole, userName, userEmail, isPremium }: SidebarProps) {
  const pathname = usePathname();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/portfolios')
      .then((r) => r.json())
      .then(setPortfolios)
      .catch(console.error);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center glow-brand-sm">
            <Wallet className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-base font-bold text-text-primary">
            tu<span className="text-brand-400">Control</span>
          </span>
        </Link>
      </div>

      {/* Nav principal */}
      <nav className="px-3 py-4 space-y-1">
        {mainNavLinks.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn('sidebar-link', isActive(href, exact) && 'active')}
            onClick={() => setMobileOpen(false)}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Portafolios */}
      <div className="px-3 py-2 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Portafolios
          </span>
          <Link
            href="/dashboard"
            className="w-5 h-5 rounded-md bg-surface-muted hover:bg-brand-500/20 flex items-center justify-center transition-colors"
            title="Crear portafolio"
          >
            <Plus className="w-3 h-3 text-text-muted" />
          </Link>
        </div>

        <div className="space-y-0.5">
          {portfolios.length === 0 ? (
            <p className="text-xs text-text-muted px-2 py-2">Sin portafolios</p>
          ) : (
            portfolios.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/portfolio/${p.id}`}
                className={cn(
                  'sidebar-link text-xs py-2',
                  pathname === `/dashboard/portfolio/${p.id}` && 'active'
                )}
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: `${p.color}25` }}
                >
                  {p.icon}
                </span>
                <span className="truncate">{p.name}</span>
                <ChevronRight className="w-3 h-3 ml-auto text-text-muted opacity-0 group-hover:opacity-100" />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Admin link */}
      {userRole === 'admin' && (
        <div className="px-3 py-2 border-t border-surface-border">
          <Link
            href="/admin"
            className={cn('sidebar-link text-xs', pathname.startsWith('/admin') && 'active')}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            Panel Admin
          </Link>
        </div>
      )}

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-surface-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-brand-400">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-text-primary truncate">{userName}</p>
              {isPremium && (
                <span className="text-xs text-yellow-400">⭐</span>
              )}
            </div>
            <p className="text-xs text-text-muted truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn-ghost w-full justify-start text-xs py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          id="sidebar-logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden btn-secondary p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        id="mobile-menu-toggle"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-surface-border lg:hidden transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-surface border-r border-surface-border">
        <SidebarContent />
      </aside>
    </>
  );
}
