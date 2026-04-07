import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { DashboardCharts } from '@/components/charts/DashboardCharts';
import { PortfolioList } from '@/components/PortfolioList';
import { RecentTransactions } from '@/components/RecentTransactions';
import { TrendingUp, TrendingDown, PiggyBank, Wallet, Plus } from 'lucide-react';
import { CreatePortfolioModal } from '@/components/CreatePortfolioModal';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  // Fetch portfolios with transactions
  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
    include: { transactions: true },
    orderBy: { createdAt: 'asc' },
  });

  // Calculate totals across all portfolios
  let totalIncome = 0;
  let totalExpense = 0;
  let totalSaving = 0;

  const monthlyData: Record<string, { income: number; expense: number; saving: number }> = {};

  portfolios.forEach((p) => {
    p.transactions.forEach((tx) => {
      const month = new Date(tx.date).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0, saving: 0 };

      if (tx.type === 'income') { totalIncome += tx.amount; monthlyData[month].income += tx.amount; }
      if (tx.type === 'expense') { totalExpense += tx.amount; monthlyData[month].expense += tx.amount; }
      if (tx.type === 'saving') { totalSaving += tx.amount; monthlyData[month].saving += tx.amount; }
    });
  });

  const balance = totalIncome - totalExpense - totalSaving;
  const budgetUsed = totalIncome > 0 ? Math.min(((totalExpense + totalSaving) / totalIncome) * 100, 100) : 0;

  const chartData = Object.entries(monthlyData).slice(-6).map(([month, values]) => ({
    month,
    ...values,
  }));

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  portfolios.forEach((p) => {
    p.transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        categoryMap[tx.category] = (categoryMap[tx.category] ?? 0) + tx.amount;
      });
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      portfolio: { userId },
    },
    orderBy: { date: 'desc' },
    take: 8,
    include: { portfolio: { select: { name: true, color: true } } },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Resumen General</h1>
          <p className="text-text-secondary text-sm mt-1">
            Bienvenido, {session!.user.name?.split(' ')[0]}. Aquí está tu panorama financiero.
          </p>
        </div>
        <CreatePortfolioModal />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card stat-card-balance">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-brand-400" />
            </div>
            <span className="text-xs text-text-muted font-mono">balance</span>
          </div>
          <div className={`text-2xl lg:text-3xl font-bold mb-1 ${balance >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </div>
          <div className="text-xs text-text-muted">Balance total</div>
          <div className="progress-bar mt-3">
            <div className="progress-fill" style={{ width: `${Math.min(budgetUsed, 100)}%` }} />
          </div>
          <div className="text-xs text-text-muted mt-1">{budgetUsed.toFixed(0)}% del presupuesto usado</div>
        </div>

        <div className="stat-card stat-card-income">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-brand-400" />
            </div>
            <span className="text-xs text-text-muted font-mono">ingresos</span>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-brand-400 mb-1">
            {formatCurrency(totalIncome)}
          </div>
          <div className="text-xs text-text-muted">Total ingresos</div>
        </div>

        <div className="stat-card stat-card-expense">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-xs text-text-muted font-mono">gastos</span>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-red-400 mb-1">
            {formatCurrency(totalExpense)}
          </div>
          <div className="text-xs text-text-muted">Total gastos</div>
        </div>

        <div className="stat-card stat-card-saving">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs text-text-muted font-mono">ahorros</span>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-amber-400 mb-1">
            {formatCurrency(totalSaving)}
          </div>
          <div className="text-xs text-text-muted">Total ahorros</div>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts chartData={chartData} categoryData={categoryData} />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portafolios */}
        <PortfolioList portfolios={portfolios} />

        {/* Transacciones recientes */}
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
