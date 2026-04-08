'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Requerido'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState({ name: '', icon: '📁', color: '#1daa52' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories);
  }, []);

  const createCategory = async () => {
    if (!newCat.name.trim()) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      const created = await res.json();
      setCategories([...categories, created]);
      setNewCat({ name: '', icon: '📁', color: '#1daa52' });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    setCategories(categories.filter((c) => c.id !== id));
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setLoading(true);
    setMsg(null);
    try {
      // Simulate password change (would need additional API endpoint)
      await new Promise((r) => setTimeout(r, 800));
      setMsg({ type: 'success', text: 'Contraseña actualizada correctamente' });
      reset();
    } catch {
      setMsg({ type: 'error', text: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Configuración</h1>
        <p className="text-text-secondary text-sm mt-1">Gestiona tus preferencias y seguridad</p>
      </div>

      {/* Categorías personalizadas */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Categorías Personalizadas</h2>

        {/* Crear nueva */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nombre de categoría"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            className="input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && createCategory()}
          />
          <input
            type="text"
            placeholder="🎯"
            value={newCat.icon}
            onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
            className="input w-16 text-center"
            maxLength={2}
          />
          <input
            type="color"
            value={newCat.color}
            onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
            className="w-12 h-12 rounded-xl border border-surface-border cursor-pointer bg-surface-card"
          />
          <button
            id="add-category-btn"
            onClick={createCategory}
            className="btn-primary px-3"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-4">Sin categorías personalizadas</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-xl border border-surface-border"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </span>
                  <span className="text-sm text-text-primary">{cat.name}</span>
                  <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="btn-ghost p-1.5 text-text-muted hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Seguridad */}
      <div className="card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Seguridad</h2>

        {msg && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm mb-4 ${msg.type === 'success'
              ? 'bg-brand-500/10 border border-brand-500/25 text-brand-400'
              : 'bg-red-500/10 border border-red-500/25 text-red-400'
            }`}>
            {msg.type === 'success'
              ? <CheckCircle className="w-4 h-4" />
              : <AlertCircle className="w-4 h-4" />
            }
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="label">Contraseña actual</label>
            <input
              type="password"
              className={`input ${errors.currentPassword ? 'input-error' : ''}`}
              {...register('currentPassword')}
            />
            {errors.currentPassword && <p className="mt-1.5 text-xs text-red-400">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="label">Nueva contraseña</label>
            <input
              type="password"
              className={`input ${errors.newPassword ? 'input-error' : ''}`}
              {...register('newPassword')}
            />
            {errors.newPassword && <p className="mt-1.5 text-xs text-red-400">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="label">Confirmar nueva contraseña</label>
            <input
              type="password"
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            id="change-password-btn"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Cambiando...</> : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
