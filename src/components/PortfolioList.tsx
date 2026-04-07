'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, PiggyBank, ChevronRight } from 'lucide-react';

interface Portfolio {
  id: string;
  name: string;
  icon: string;
  color: string;
  label: string;
  transactions: { amount: number; type: string }[];
}

export function PortfolioList({ portfolios }: { portfolios: Portfolio[] }) {
  if (portfolios.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3">💼</div>
        <h3 className="text-base font-semibold text-text-primary mb-1">Sin portafolios</h3>
        <p className="text-text-muted text-sm">Crea tu primer portafolio para comenzar</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-text-primary mb-4">Mis Portafolios</h3>
      <div className="space-y-3">
        {portfolios.map((p) => {
          const income = p.transactions
            .filter((t) => t.type === 'income')
            .reduce((s, t) => s + t.amount, 0);
          const expense = p.transactions
            .filter((t) => t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);
          const saving = p.transactions
            .filter((t) => t.type === 'saving')
            .reduce((s, t) => s + t.amount, 0);
          const balance = income - expense - saving;

          return (
            <Link
              key={p.id}
              href={`/dashboard/portfolio/${p.id}`}
              className="flex items-center justify-between p-3 rounded-xl border border-surface-border hover:border-surface-muted hover:bg-surface-card/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${p.color}20`, border: `1px solid ${p.color}40` }}
                >
                  {p.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{p.name}</p>
                  <p className="text-xs text-text-muted">{p.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-brand-400">
                    <TrendingUp className="w-3 h-3" />
                    {formatCurrency(income)}
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <TrendingDown className="w-3 h-3" />
                    {formatCurrency(expense)}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <PiggyBank className="w-3 h-3" />
                    {formatCurrency(saving)}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${balance >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
                    {formatCurrency(balance)}
                  </p>
                  <p className="text-xs text-text-muted">{p.transactions.length} movimientos</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
