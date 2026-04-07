'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Loader2 } from 'lucide-react';

const schema = z.object({
  amount: z.string().min(1, 'El monto es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  type: z.enum(['expense', 'income', 'saving']),
  category: z.string().min(1, 'La categoría es requerida'),
  portfolioId: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface TransactionFormProps {
  portfolioId: string;
  categories: Category[];
  onSuccess?: () => void;
}

const DEFAULT_CATEGORIES = [
  'Alimentación', 'Transporte', 'Vivienda', 'Salud', 'Entretenimiento',
  'Ropa', 'Educación', 'Trabajo', 'Ahorro', 'Otros',
];

export function TransactionForm({ portfolioId, categories, onSuccess }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      portfolioId,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedType = watch('type');

  const typeColors: Record<string, string> = {
    expense: '#ef4444',
    income: '#1daa52',
    saving: '#f59e0b',
  };

  const typeLabels: Record<string, string> = {
    expense: 'Gasto',
    income: 'Ingreso',
    saving: 'Ahorro',
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount),
        }),
      });
      if (res.ok) {
        setOpen(false);
        reset();
        router.refresh();
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.length > 0
    ? categories.map((c) => c.name)
    : DEFAULT_CATEGORIES;

  return (
    <>
      <button
        id="add-transaction-btn"
        onClick={() => setOpen(true)}
        className="btn-primary gap-2"
      >
        <Plus className="w-4 h-4" />
        Añadir
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">Nueva Transacción</h2>
              <button onClick={() => setOpen(false)} className="btn-ghost p-1.5" id="close-transaction-modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Tipo */}
              <div>
                <label className="label">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['expense', 'income', 'saving'] as const).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center justify-center p-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium ${
                        selectedType === type
                          ? 'border-current'
                          : 'border-surface-border text-text-muted hover:border-surface-muted'
                      }`}
                      style={selectedType === type ? {
                        color: typeColors[type],
                        background: `${typeColors[type]}15`,
                        borderColor: `${typeColors[type]}60`,
                      } : {}}
                    >
                      <input type="radio" value={type} {...register('type')} className="sr-only" />
                      {typeLabels[type]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Monto */}
              <div>
                <label className="label">Monto</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={`input pl-7 font-mono ${errors.amount ? 'input-error' : ''}`}
                    {...register('amount')}
                  />
                </div>
                {errors.amount && <p className="mt-1.5 text-xs text-red-400">{errors.amount.message}</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className="label">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Supermercado, Sueldo, Ahorro emergencia..."
                  className={`input ${errors.description ? 'input-error' : ''}`}
                  {...register('description')}
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-400">{errors.description.message}</p>}
              </div>

              {/* Categoría y Fecha en dos columnas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Categoría</label>
                  <select className={`input ${errors.category ? 'input-error' : ''}`} {...register('category')}>
                    <option value="">Seleccionar...</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1.5 text-xs text-red-400">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="label">Fecha</label>
                  <input
                    type="date"
                    className={`input ${errors.date ? 'input-error' : ''}`}
                    {...register('date')}
                  />
                  {errors.date && <p className="mt-1.5 text-xs text-red-400">{errors.date.message}</p>}
                </div>
              </div>

              <input type="hidden" {...register('portfolioId')} />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1 justify-center">
                  Cancelar
                </button>
                <button type="submit" id="submit-transaction" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
