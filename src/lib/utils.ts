import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateInput(date: Date | string): string {
  return new Date(date).toISOString().split('T')[0];
}

export function getMonthName(month: number): string {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  return months[month];
}

export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    expense: 'Gasto',
    income: 'Ingreso',
    saving: 'Ahorro',
  };
  return labels[type] ?? type;
}

export function getTransactionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    expense: '#ef4444',
    income: '#1daa52',
    saving: '#f59e0b',
  };
  return colors[type] ?? '#6b7280';
}
