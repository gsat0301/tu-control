import { formatCurrency, formatDate, getTransactionTypeColor, getTransactionTypeLabel } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: string;
  category: string;
  portfolio: { name: string; color: string };
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">Transacciones Recientes</h3>
        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
        >
          Ver todas
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-3xl mb-2">💳</div>
          <p className="text-text-muted text-sm">Sin transacciones aún</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-card/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${getTransactionTypeColor(tx.type)}20` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: getTransactionTypeColor(tx.type) }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary leading-tight">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-muted">{tx.category}</span>
                    <span className="text-text-muted text-xs">·</span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: tx.portfolio.color }}
                    >
                      {tx.portfolio.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: getTransactionTypeColor(tx.type) }}
                >
                  {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-xs text-text-muted">{formatDate(tx.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
