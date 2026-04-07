'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ChartData {
  month: string;
  income: number;
  expense: number;
  saving: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  chartData: ChartData[];
  categoryData: CategoryData[];
}

const CATEGORY_COLORS = [
  '#1daa52', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-surface-border shadow-xl">
        <p className="text-xs font-semibold text-text-secondary mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-text-muted capitalize">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-surface-border shadow-xl">
        <p className="text-xs font-semibold text-text-primary">{payload[0].name}</p>
        <p className="text-xs text-brand-400 font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function DashboardCharts({ chartData, categoryData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Barras — Ingresos vs Gastos */}
      <div className="card lg:col-span-2">
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Ingresos vs Gastos
        </h3>
        <p className="text-xs text-text-muted mb-5">Últimos 6 meses</p>

        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-text-muted text-sm">Sin datos aún. Agrega transacciones.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#515e7a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#515e7a', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="income" name="Ingresos" fill="#1daa52" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saving" name="Ahorros" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Dona — Gastos por categoría */}
      <div className="card">
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Gastos por Categoría
        </h3>
        <p className="text-xs text-text-muted mb-4">Distribución actual</p>

        {categoryData.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-text-muted text-sm text-center">Sin gastos registrados</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#8b9abf', fontSize: '11px' }}>{value}</span>
                )}
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

interface SavingsChartProps {
  data: { month: string; saving: number; cumulative: number }[];
}

export function SavingsChart({ data }: SavingsChartProps) {
  return (
    <div className="card">
      <h3 className="text-base font-semibold text-text-primary mb-1">Evolución de Ahorros</h3>
      <p className="text-xs text-text-muted mb-5">Acumulado mensual</p>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-text-muted text-sm">Sin ahorros registrados aún</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#515e7a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#515e7a', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="cumulative"
              name="Acumulado"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="saving"
              name="Mes"
              stroke="#1daa52"
              strokeWidth={2}
              dot={{ fill: '#1daa52', r: 3 }}
              strokeDasharray="4 2"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
