'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  label: z.string().min(1),
  color: z.string(),
  icon: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const PORTFOLIO_ICONS = ['💼', '🏠', '❤️', '🎯', '✈️', '🎓', '💡', '🌱', '🏋️', '🎮'];
const PORTFOLIO_COLORS = ['#1daa52', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
const PORTFOLIO_LABELS = ['Personal', 'Negocio', 'Pareja', 'Viajes', 'Familia', 'Proyecto', 'Salud', 'Educación'];

export function CreatePortfolioModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      label: 'Personal',
      color: '#1daa52',
      icon: '💼',
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setOpen(false);
        reset();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        id="create-portfolio-btn"
        onClick={() => setOpen(true)}
        className="btn-primary gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Nuevo Portafolio</span>
        <span className="sm:hidden">Nuevo</span>
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">Crear Portafolio</h2>
              <button onClick={() => setOpen(false)} className="btn-ghost p-1.5" id="close-portfolio-modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Preview */}
              <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-xl">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${selectedColor}25`, border: `2px solid ${selectedColor}60` }}
                >
                  {selectedIcon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {watch('name') || 'Nombre del portafolio'}
                  </p>
                  <p className="text-xs text-text-muted">{watch('label')}</p>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="label">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Gastos del Hogar"
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  {...register('name')}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
              </div>

              {/* Label */}
              <div>
                <label className="label">Tipo</label>
                <div className="flex flex-wrap gap-2">
                  {PORTFOLIO_LABELS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setValue('label', label)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        watch('label') === label
                          ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50'
                          : 'bg-surface-muted text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icono */}
              <div>
                <label className="label">Icono</label>
                <div className="flex flex-wrap gap-2">
                  {PORTFOLIO_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setValue('icon', icon)}
                      className={`w-9 h-9 rounded-lg text-lg transition-all ${
                        selectedIcon === icon
                          ? 'bg-brand-500/20 border border-brand-500/50 scale-110'
                          : 'bg-surface-muted hover:bg-surface-border'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="label">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PORTFOLIO_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className={`w-7 h-7 rounded-full transition-all ${
                        selectedColor === color ? 'scale-125 ring-2 ring-white/30' : ''
                      }`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-secondary flex-1 justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-portfolio"
                  disabled={loading}
                  className="btn-primary flex-1 justify-center"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
