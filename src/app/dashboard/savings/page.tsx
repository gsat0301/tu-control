import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, getMonthName } from '@/lib/utils';
import { SavingsChart } from '@/components/charts/DashboardCharts';
import { PiggyBank } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Ahorros' };

export default async function SavingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
    include: {
      transactions: {
        where: { type: 'saving' },
        orderBy: { date: 'asc' },
      },
    },
  });

  const allSavings = portfolios.flatMap((p) =>
    p.transactions.map((t) => ({ ...t, portfolioName: p.name, portfolioColor: p.color }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalSavings = allSavings.reduce((s, t) => s + t.amount, 0);

  // Monthly data for chart
  const monthlyMap = new Map<string, number>();
  allSavings.forEach((t) => {
    const d = new Date(t.date);
    const key = `${getMonthName(d.getMonth())} ${d.getFullYear().toString().slice(2)}`;
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + t.amount);
  });

  let cumulative = 0;
  const chartData = Array.from(monthlyMap.entries()).map(([month, saving]) => {
    cumulative += saving;
    return { month, saving, cumulative };
  });

  // By portfolio
  const byPortfolio = portfolios.map((p) => ({
    id: p.id,
    name: p.name,
    icon: p.icon,
    color: p.color,
    total: p.transactions.reduce((s, t) => s + t.amount, 0),
    count: p.transactions.length,
  })).filter((p) => p.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Ahorros</h1>
        <p className="text-text-secondary text-sm mt-1">Evolución y detalle de tus ahorros acumulados</p>
      </div>

      {/* Total ahorros */}
      <div className="card border-amber-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            <PiggyBank className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Total acumulado en ahorros</p>
            <p className="text-4xl font-bold text-amber-400">{formatCurrency(totalSavings)}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <SavingsChart data={chartData} />

      {/* Por portafolio */}
      {byPortfolio.length > 0 && (
        <div className="card">
          <h3 className="text-base font-semibold text-text-primary mb-4">Ahorros por Portafolio</h3>
          <div className="space-y-4">
            {byPortfolio.map((p) => {
              const pct = totalSavings > 0 ? (p.total / totalSavings) * 100 : 0;
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-sm font-medium text-text-primary">{p.name}</span>
                      <span className="text-xs text-text-muted">({p.count} depósitos)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-semibold text-amber-400">{formatCurrency(p.total)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: p.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Historial de ahorros */}
      <div className="card">
        <h3 className="text-base font-semibold text-text-primary mb-4">Historial de Depósitos</h3>
        {allSavings.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-4xl mb-3">🏦</div>
            <p className="text-text-muted text-sm">Sin ahorros aún. Agrega transacciones de tipo "Ahorro".</p>
          </div>
        ) : (
          <div className="table-container border-none overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Portafolio</th>
                  <th>Fecha</th>
                  <th className="text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {allSavings.slice().reverse().map((t) => (
                  <tr key={t.id}>
                    <td className="font-medium">{t.description}</td>
                    <td>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-lg"
                        style={{ color: t.portfolioColor, background: `${t.portfolioColor}15` }}
                      >
                        {t.portfolioName}
                      </span>
                    </td>
                    <td className="text-text-secondary text-xs">
                      {new Date(t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="text-right font-semibold font-mono text-amber-400">
                      +{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
