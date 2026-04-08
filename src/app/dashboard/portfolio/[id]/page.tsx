import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatCurrency, formatDate, getTransactionTypeColor, getTransactionTypeLabel } from '@/lib/utils';
import { TransactionForm } from '@/components/TransactionForm';
import { DashboardCharts } from '@/components/charts/DashboardCharts';
import { TrendingUp, TrendingDown, PiggyBank, Pencil } from 'lucide-react';
import { DeleteTransactionButton } from '@/components/DeleteTransactionButton';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Portafolio` };
}

export default async function PortfolioPage({ params }: Props) {
  const session = await auth();
  const userId = session!.user.id;

  const portfolio = await prisma.portfolio.findFirst({
    where: { id: params.id, userId },
    include: {
      transactions: {
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!portfolio) notFound();

  const categories = await prisma.category.findMany({ where: { userId } });

  const income = portfolio.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = portfolio.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const saving = portfolio.transactions.filter((t) => t.type === 'saving').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense - saving;

  // Monthly chart data
  const monthlyMap: Record<string, { income: number; expense: number; saving: number }> = {};
  portfolio.transactions.forEach((tx) => {
    const key = new Date(tx.date).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0, saving: 0 };
    if (tx.type === 'income') monthlyMap[key].income += tx.amount;
    if (tx.type === 'expense') monthlyMap[key].expense += tx.amount;
    if (tx.type === 'saving') monthlyMap[key].saving += tx.amount;
  });
  const chartData = Object.entries(monthlyMap).slice(-6).map(([month, v]) => ({ month, ...v }));

  const categoryMap: Record<string, number> = {};
  portfolio.transactions.filter((t) => t.type === 'expense').forEach((tx) => {
    categoryMap[tx.category] = (categoryMap[tx.category] ?? 0) + tx.amount;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `${portfolio.color}25`, border: `2px solid ${portfolio.color}50` }}
          >
            {portfolio.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{portfolio.name}</h1>
            <p className="text-text-muted text-sm">{portfolio.label} · {portfolio.transactions.length} transacciones</p>
          </div>
        </div>
        <TransactionForm portfolioId={portfolio.id} categories={categories} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card stat-card-balance">
          <p className="text-xs text-text-muted mb-2">Balance</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="stat-card stat-card-income">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
            <p className="text-xs text-text-muted">Ingresos</p>
          </div>
          <p className="text-2xl font-bold text-brand-400">{formatCurrency(income)}</p>
        </div>
        <div className="stat-card stat-card-expense">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            <p className="text-xs text-text-muted">Gastos</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(expense)}</p>
        </div>
        <div className="stat-card stat-card-saving">
          <div className="flex items-center gap-1.5 mb-2">
            <PiggyBank className="w-3.5 h-3.5 text-amber-400" />
            <p className="text-xs text-text-muted">Ahorros</p>
          </div>
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(saving)}</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <DashboardCharts chartData={chartData} categoryData={categoryData} />
      )}

      {/* Transactions table */}
      <div className="card">
        <h3 className="text-base font-semibold text-text-primary mb-4">Historial de Transacciones</h3>
        {portfolio.transactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">💳</div>
            <p className="text-text-muted">Sin transacciones. Usa el botón "Añadir" para comenzar.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th className="text-right">Monto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {portfolio.transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-medium">{tx.description}</td>
                    <td>
                      <span
                        className="badge text-xs"
                        style={{
                          color: getTransactionTypeColor(tx.type),
                          background: `${getTransactionTypeColor(tx.type)}15`,
                          borderColor: `${getTransactionTypeColor(tx.type)}30`,
                        }}
                      >
                        {getTransactionTypeLabel(tx.type)}
                      </span>
                    </td>
                    <td className="text-text-secondary">{tx.category}</td>
                    <td className="text-text-secondary text-xs">{formatDate(tx.date)}</td>
                    <td className="text-right font-semibold font-mono"
                      style={{ color: getTransactionTypeColor(tx.type) }}>
                      {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </td>
                    <td>
                      <DeleteTransactionButton id={tx.id} />
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
