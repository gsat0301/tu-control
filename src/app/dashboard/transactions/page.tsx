import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, getTransactionTypeColor, getTransactionTypeLabel } from '@/lib/utils';
import { DeleteTransactionButton } from '@/components/DeleteTransactionButton';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Transacciones' };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { type?: string; portfolio?: string };
}) {
  const session = await auth();
  const userId = session!.user.id;

  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
    select: { id: true, name: true, color: true },
  });

  const portfolioIds = portfolios.map((p) => p.id);

  const transactions = await prisma.transaction.findMany({
    where: {
      portfolioId: {
        in: searchParams.portfolio
          ? [searchParams.portfolio].filter((id) => portfolioIds.includes(id))
          : portfolioIds,
      },
      ...(searchParams.type ? { type: searchParams.type as 'expense' | 'income' | 'saving' } : {}),
    },
    orderBy: { date: 'desc' },
    include: { portfolio: { select: { name: true, color: true } } },
  });

  const categories = await prisma.category.findMany({ where: { userId } });

  const totals = {
    income: transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expense: transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    saving: transactions.filter((t) => t.type === 'saving').reduce((s, t) => s + t.amount, 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Transacciones</h1>
          <p className="text-text-secondary text-sm mt-1">{transactions.length} movimientos registrados</p>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-text-muted mb-1">Total Ingresos</p>
          <p className="text-xl font-bold text-brand-400">{formatCurrency(totals.income)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-text-muted mb-1">Total Gastos</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(totals.expense)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-text-muted mb-1">Total Ahorros</p>
          <p className="text-xl font-bold text-amber-400">{formatCurrency(totals.saving)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="label text-xs">Tipo</label>
            <form method="GET">
              <select
                name="type"
                defaultValue={searchParams.type ?? ''}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  if (e.target.value) url.searchParams.set('type', e.target.value);
                  else url.searchParams.delete('type');
                  window.location.href = url.toString();
                }}
                className="input text-sm py-2"
              >
                <option value="">Todos</option>
                <option value="income">Ingresos</option>
                <option value="expense">Gastos</option>
                <option value="saving">Ahorros</option>
              </select>
            </form>
          </div>
          <div>
            <label className="label text-xs">Portafolio</label>
            <select
              defaultValue={searchParams.portfolio ?? ''}
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set('portfolio', e.target.value);
                else url.searchParams.delete('portfolio');
                // @ts-ignore
                window.location.href = url.toString();
              }}
              className="input text-sm py-2"
            >
              <option value="">Todos</option>
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">💳</div>
            <p className="text-text-muted">Sin transacciones con estos filtros</p>
          </div>
        ) : (
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Portafolio</th>
                  <th>Fecha</th>
                  <th className="text-right">Monto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
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
                    <td>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-lg"
                        style={{
                          color: tx.portfolio.color,
                          background: `${tx.portfolio.color}15`,
                        }}
                      >
                        {tx.portfolio.name}
                      </span>
                    </td>
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
